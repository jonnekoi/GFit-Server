import {
    fetchAllClients,
    postNewClient,
    fetchClientData,
    fetchClientWeights,
    sendClientWorkout,
    createNewExercise, putClientUpdateWorkout, deleteClientWorkoutDb
} from "../model/clientModel.js";

const addNewClient = async (req, res) => {
    try {
        const code = generateRandomCode(8);

        const status = "Pending";

        const date = new Date();

        const client = {
            FirstName: req.body.firstName,
            LastName: req.body.lastName,
            plan: req.body.plan,
            birthday: req.body.birthday,
            weight: req.body.weight,
            targetWeight: req.body.targetWeight,
            clientRegisterCode: code,
            status: status,
            email: req.body.email,
            address: req.body.address,
            city: req.body.city,
            postalCode: req.body.postalCode,
            memberSince: date
        }

        const saveClient = await postNewClient(client);
        if (saveClient.affectedRows === 1) {
            return res.status(201).json({message: "Client added", clientRegisterCode: client.clientRegisterCode});
        }
        res.status(401).json({message: "Client not added"});
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
        console.log(error);
    }
}

const getAllClients = async (req, res) => {
    const { type } = req.query;
    try {
        const clients = await fetchAllClients(type);
        res.status(200).json(clients);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const generateRandomCode = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const getClientData = async (req, res) => {
    try {
        const client = await fetchClientData(req.params.id);
        console.log(client);
        res.status(200).json(client);
    } catch (error) {
        console.log(error);
    }
}

const getClientWeights = async (req, res) => {
    try {
        const weights = await fetchClientWeights(req.params.id);
        res.status(200).json(weights);
    } catch (error) {
        console.log(error);
    }
}

const setClientWorkout = async (req, res) => {
    try {
        const { client_id, workout_id, exercises, workout_day } = req.body;

        const existingExercises = exercises.filter(exercise => exercise.exercise_id);
        const newExercises = exercises.filter(exercise => !exercise.exercise_id);



        if (newExercises.length > 0) {
            const createdExercises = await Promise.all(
                newExercises.map(async (exercise) => {
                    const name = exercise.exercise_name;
                    const result = await createNewExercise(name);

                    return {
                        ...exercise,
                        exercise_id: result.id
                    };
                })
            );

            const allExercises = [...existingExercises, ...createdExercises];

            const workout = await sendClientWorkout({ client_id, workout_id, exercises: allExercises, workout_day });

            if (workout.error) {
                return res.status(409).json({ message: workout.message });
            } else {
                return res.status(200).json(workout);
            }
        } else {
            const workout = await sendClientWorkout({ client_id, workout_id, exercises: existingExercises, workout_day });

            if (workout.message === 'Error') {
                res.status(409).json(workout);
            } else {
                res.status(200).json(workout);
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while setting the client workout.' });
    }
}

const updateClientWorkout = async (req, res) => {
    try {
        const { client_id, workout_id, exercises, workout_day } = req.body;


        const existingExercises = exercises.filter(exercise => exercise.id);
        const newExercises = exercises.filter(exercise => !exercise.id);

        let allExercises = [...existingExercises];

        if (newExercises && newExercises.length > 0) {
            console.log(`Processing ${newExercises.length} new exercises`);

            const createdExercises = await Promise.all(
                newExercises.map(async (exercise) => {
                    try {
                        const result = await createNewExercise(exercise.name);
                        return {
                            ...exercise,
                            id: result.id
                        };
                    } catch (error) {
                        console.log(error)
                        throw error;
                    }
                })
            );

            allExercises = [...existingExercises, ...createdExercises];
        }

        const workout = await putClientUpdateWorkout({
            client_id,
            workout_id,
            exercises: allExercises,
            workout_day
        });

        if (workout.message === 'Error') {
            res.status(409).json(workout);
        } else {
            res.status(200).json(workout);
        }
    } catch (error) {
        console.error('Error updating client workout:', error);
        res.status(500).json({ error: 'An error occurred while updating the client workout.' });
    }
};

const deleteClientWorkout = async (req, res) => {
    console.log(req.body);
    try {
        const { client_id, workout_id, workout_day } = req.body;
        const workout = await deleteClientWorkoutDb({ client_id, workout_id, workout_day });
        if (workout.message === 'Error') {
            res.status(409).json(workout);
        }
        res.status(200).json(workout);
    } catch (error) {
        console.error('Error deleting client workout:', error);
        res.status(500).json({ error: 'An error occurred while deleting the client workout.' });
    }
}


export { addNewClient, getAllClients, getClientData, getClientWeights, setClientWorkout, updateClientWorkout, deleteClientWorkout };
