import express  from 'express';

import {getAllWorkouts, addExercise, getAllExercises} from '../controller/workoutController.js';

const workoutRouter = express.Router();

workoutRouter.route('/').get(getAllWorkouts);
workoutRouter.route('/exercise/add').post(addExercise);
workoutRouter.route('/exercise').get(getAllExercises);


export default workoutRouter;
