import express  from 'express';
import authToken from "../../utils/middlewares.js";
import {addMealForClient, fetchClientMealData, getAllMeals, getAllIngredients, updateClientMeal, getClientTargets, updateClientTargets} from "../controller/mealController.js";

const mealRouter = express.Router();



mealRouter.route('/').get(getAllMeals);
mealRouter.route('/ingredients').get(getAllIngredients);
mealRouter.route('/:id').get(fetchClientMealData);
mealRouter.route('/client/update').put(updateClientMeal);
mealRouter.route('/client/add/:id').post(authToken, addMealForClient);
mealRouter.route('/client/targets/:id').get(authToken, getClientTargets).put(authToken, updateClientTargets);





export default mealRouter;
