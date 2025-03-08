import express  from 'express';

import {getAllWorkouts, addExercise, getAllExercises, addNewWorkout, updateWorkout} from '../controller/workoutController.js';
import authToken from "../../utils/middlewares.js";


const isCoach = (req, res, next) => {
    if (res.locals.user.role === "coach") {
        next();
    } else {
        console.log("Ollaan täs!")
        res.status(403).send({ message: "Unauthorized" });
    }
}

const workoutRouter = express.Router();

workoutRouter.route('/').get(getAllWorkouts).put(updateWorkout);
workoutRouter.route('/exercise/add').post(addExercise);
workoutRouter.route('/exercise').get(getAllExercises);
workoutRouter.route('/add').post(addNewWorkout);


export default workoutRouter;
