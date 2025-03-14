import express  from 'express';
import authToken from "../../utils/middlewares.js";
import {addMealForClient, fetchClientMealData, getAllMeals} from "../controller/mealController.js";

const mealRouter = express.Router();



mealRouter.route('/').get(getAllMeals);
mealRouter.route('/:id').get(fetchClientMealData);
mealRouter.route('/client/add/:id').post(authToken, addMealForClient);





export default mealRouter;
