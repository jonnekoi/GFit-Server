import express  from 'express';

import {getAllWorkouts, addExercise, getAllExercises, addNewWorkout, updateWorkout} from '../controller/workoutController.js';
import authToken from "../../utils/middlewares.js";


const isCoach = (req, res, next) => {
    if (res.locals.user.access === "coach") {
        next();
    } else {
        res.status(403).send({ message: "Unauthorized" });
    }
}

const workoutRouter = express.Router();

workoutRouter.route('/').get(authToken, isCoach, getAllWorkouts).put(updateWorkout);
workoutRouter.route('/exercise/add').post(authToken, isCoach, addExercise);
workoutRouter.route('/exercise').get(authToken, isCoach, getAllExercises);
workoutRouter.route('/add').post(authToken, isCoach, addNewWorkout);


export default workoutRouter;
