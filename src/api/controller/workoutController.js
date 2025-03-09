import {fetchAllWorkouts, postExercise, fetchAllExercises, postWorkout, putUpdateWorkout} from "../model/workoutModel.js";

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

const updateWorkout = async (req, res) => {
    try {
        console.log("TÄSSÄ UPDATE BODY", req.body);
        const result = await putUpdateWorkout(req.body);
        console.log(result);
        if (result) {
            res.status(201).json({message: "Workout Updated!"});
        } else {
            res.status(400).json({message: "Failed to update workout"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
}

export {getAllWorkouts, addExercise, getAllExercises, addNewWorkout, updateWorkout};
