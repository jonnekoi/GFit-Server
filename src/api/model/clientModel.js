import promisePool from "../../utils/database.js";

const postNewClient = async (client) => {
    try {
       const {FirstName, LastName, plan, birthday, clientRegisterCode, status, email, address, city, postalCode, memberSince} = client;
       const sql = `INSERT INTO clients (FirstName, LastName, plan, birthday, clientRegisterCode, status, email, address, city, postalCode, memberSince) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
       const params = [FirstName, LastName, plan, birthday, clientRegisterCode, status, email, address, city, postalCode, memberSince];
       const [result] = await promisePool.execute(sql, params);
       return result;
    } catch (error) {
        console.log(error);
    }
}

const fetchAllClients = async (type) => {
    try {
        let sql = `
            SELECT c.*, cp.plan_name AS plan_name
            FROM clients c
            JOIN clientsPlans cp ON c.plan = cp.id
        `;
        if (type === 'pending') {
            sql += ` WHERE c.status = 'pending'`;
        }
        const [clients] = await promisePool.execute(sql);
        return clients;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const fetchClientData = async (id) => {
    try {
        const sql = `
                SELECT c.*, c.weight AS client_weight, cp.plan_name, cw.day AS workout_day, w.id AS workout_id, w.name AS workout_name, w.description AS workout_description, w.type AS workout_type, w.level AS workout_level,
                       e.id AS exercise_id, e.name AS exercise_name, wec.low_reps, wec.weight, wec.duration, wec.max_reps, wec.descrip, wec.sets
                FROM clients c
                JOIN clientsPlans cp ON c.plan = cp.id
                LEFT JOIN clients_workouts cw ON c.id = cw.client_id
                LEFT JOIN workouts w ON cw.workout_id = w.id
                LEFT JOIN workout_exercises_client wec ON cw.client_id = wec.client_id AND cw.workout_id = wec.workout_id
                LEFT JOIN exercises e ON wec.exercise_id = e.id
                WHERE c.id = ?
            `;
        const [rows] = await promisePool.execute(sql, [id]);

        if (rows.length === 0) {
            return null;
        }

        const client = {
            id: rows[0].id,
            FirstName: rows[0].FirstName,
            LastName: rows[0].LastName,
            plan: rows[0].plan,
            birthday: rows[0].birthday,
            weight: rows[0].client_weight,
            targetWeight: rows[0].targetWeight,
            clientRegisterCode: rows[0].clientRegisterCode,
            status: rows[0].status,
            email: rows[0].email,
            address: rows[0].address,
            city: rows[0].city,
            memberSince: rows[0].memberSince,
            postalCode: rows[0].postalCode,
            plan_name: rows[0].plan_name,
            workouts: {}
        };

        rows.forEach(row => {
            if (row.workout_id) {
                if (!client.workouts[row.workout_id]) {
                    client.workouts[row.workout_id] = {
                        id: row.workout_id,
                        name: row.workout_name,
                        description: row.workout_description,
                        type: row.workout_type,
                        level: row.workout_level,
                        day: row.workout_day,
                        exercises: []
                    };
                }
                if (row.exercise_id) {
                    client.workouts[row.workout_id].exercises.push({
                        id: row.exercise_id,
                        name: row.exercise_name,
                        low_reps: row.low_reps,
                        weight: row.weight,
                        duration: row.duration,
                        max_reps: row.max_reps,
                        descrip: row.descrip,
                        sets: row.sets
                    });
                }
            }
        });
        return client;
    } catch (error) {
        console.log(error);
    }
}

const fetchClientWeights = async (id) => {
    try {
        const sql = `SELECT * FROM clientWeight WHERE userId = ?`;
        const [weights] = await promisePool.execute(sql, [id]);
        return weights;
    } catch (error) {
        console.log(error);
    }
}

const sendClientWorkout = async (workout) => {
    try {
        const { client_id, workout_id, exercises, workout_day } = workout;

        console.log(" ollaan täs",workout);

        const checkSql = `SELECT * FROM clients_workouts WHERE client_id = ? AND workout_id = ?`;
        const [rows] = await promisePool.execute(checkSql, [client_id, workout_id]);

        if (rows.length > 0) {
            return { message: 'Workout already exists. Try editing it instead.' };
        }

        const clientsWorkoutsSql = `INSERT INTO clients_workouts (client_id, workout_id, day) VALUES (?, ?, ?)`;
        const clientsWorkoutsParams = [client_id, workout_id, workout_day];
        await promisePool.execute(clientsWorkoutsSql, clientsWorkoutsParams);

        const exercisePromises = exercises.map(exercise => {
            const { exercise_id, low_reps, max_reps, weight, exercise_description, duration, sets } = exercise;
            const exerciseSql = `
                INSERT INTO workout_exercises_client (client_id, workout_id, exercise_id, low_reps, weight, duration, max_reps, descrip, sets)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const exerciseParams = [
                client_id,
                workout_id !== undefined ? workout_id : null,
                exercise_id !== undefined ? exercise_id : null,
                low_reps !== undefined ? low_reps : null,
                weight !== undefined ? weight : null,
                duration !== undefined ? duration : null,
                max_reps !== undefined ? max_reps : null,
                exercise_description !== undefined ? exercise_description : null,
                sets !== undefined ? sets : null
            ];
            return promisePool.execute(exerciseSql, exerciseParams);
        });

        await Promise.all(exercisePromises);
        return { workout_id };
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const createNewExercise = async (name) => {
    try {
        const sql = `
                        INSERT INTO exercises (name, description, created_at, isCustom)
                        VALUES (?, ?, ?, ?)
                    `;
        const description = "Custom exercise";
        const params = [
            name,
            description,
            new Date(),
            true
        ];
        const [result] = await promisePool.execute(sql, params);


        return {
            id: result.insertId,
        };
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const putClientUpdateWorkout = async (workout) => {
    console.log("workout", workout);
    try {
        const { client_id, workout_id, exercises, workout_day } = workout;

        const updateWorkoutSql = `
            UPDATE clients_workouts 
            SET day = ? 
            WHERE client_id = ? AND workout_id = ?
        `;
        await promisePool.execute(updateWorkoutSql, [
            workout_day,
            client_id,
            workout_id
        ]);


        const updatePromises = exercises.map(exercise => {
            const { id, low_reps, max_reps, weight, exercise_description, duration, sets } = exercise;

            const checkSql = `
                SELECT 1 FROM workout_exercises_client 
                WHERE client_id = ? AND workout_id = ? AND exercise_id = ?
            `;

            return promisePool.execute(checkSql, [client_id, workout_id, id])
                .then(([rows]) => {
                    if (rows.length > 0) {
                        const updateSql = `
                            UPDATE workout_exercises_client
                            SET
                                low_reps = ?,
                                weight = ?,
                                duration = ?,
                                max_reps = ?,
                                descrip = ?,
                                sets = ?
                            WHERE
                                client_id = ? AND
                                workout_id = ? AND
                                exercise_id = ?
                        `;
                        const updateParams = [
                            low_reps === undefined ? null : low_reps,
                            weight === undefined ? null : weight,
                            duration === undefined ? null : duration,
                            max_reps === undefined ? null : max_reps,
                            exercise_description === undefined ? null : exercise_description,
                            sets === undefined ? null : sets,
                            client_id,
                            workout_id,
                            id
                        ];
                        return promisePool.execute(updateSql, updateParams);
                    } else {
                        const insertSql = `
                            INSERT INTO workout_exercises_client
                            (client_id, workout_id, exercise_id, low_reps, weight, duration, max_reps, descrip, sets)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                        `;
                        const insertParams = [
                            client_id,
                            workout_id,
                            id,
                            low_reps === undefined ? null : low_reps,
                            weight === undefined ? null : weight,
                            duration === undefined ? null : duration,
                            max_reps === undefined ? null : max_reps,
                            exercise_description === undefined ? null : exercise_description,
                            sets === undefined ? null : sets
                        ];
                        return promisePool.execute(insertSql, insertParams);
                    }
                });
        });

        await Promise.all(updatePromises);
        return { message: 'Workout updated successfully.' };
    } catch (error) {
        console.log(error);
        return { message: 'Error' };
    }
};

export { postNewClient, fetchAllClients, fetchClientData, fetchClientWeights, sendClientWorkout, createNewExercise, putClientUpdateWorkout };
