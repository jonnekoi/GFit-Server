import {fetchAllWorkouts, postExercise, fetchAllExercises, postWorkout} from "../model/workoutModel.js";

const getAllWorkouts = async (req, res) => {
    try {
        res.json(await fetchAllWorkouts());
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
}

const addExercise = async (req, res) => {
    try {
        const result = await postExercise(req.body);
        if (result) {
            res.status(201).json({message: "Exercise added!"});
        } else {
            res.status(400).json({message: "Failed to add exercise"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
}

const getAllExercises = async (req, res) => {
    try {
        res.json(await fetchAllExercises());
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
}

const addNewWorkout = async (req, res) => {
    try {
        console.log("TÄSSÄ ADD NEW BODY", req.body);
        const result = await postWorkout(req.body);
        console.log(result);
        if (result) {
            res.status(201).json({message: "Workout added!"});
        } else {
            res.status(400).json({message: "Failed to add workout"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
}

export {getAllWorkouts, addExercise, getAllExercises, addNewWorkout};
