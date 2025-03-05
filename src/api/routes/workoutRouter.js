import express  from 'express';

import {getAllWorkouts, addExercise, getAllExercises, addNewWorkout} from '../controller/workoutController.js';

const workoutRouter = express.Router();

workoutRouter.route('/').get(getAllWorkouts);
workoutRouter.route('/exercise/add').post(addExercise);
workoutRouter.route('/exercise').get(getAllExercises);
workoutRouter.route('/add').post(addNewWorkout);


export default workoutRouter;
