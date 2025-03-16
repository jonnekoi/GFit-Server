import express  from 'express';
import authToken from "../../utils/middlewares.js";
import {addMealForClient, fetchClientMealData, getAllMeals, getAllIngredients, updateClientMeal, getClientTargets, updateClientTargets} from "../controller/mealController.js";

const mealRouter = express.Router();

const isCoach = (req, res, next) => {
    if (res.locals.user.access === 'coach') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied' });
    }
};



mealRouter.route('/').get(authToken, isCoach, getAllMeals);
mealRouter.route('/ingredients').get(authToken, isCoach, getAllIngredients);
mealRouter.route('/:id').get(authToken, isCoach, fetchClientMealData);
mealRouter.route('/client/update').put(authToken, isCoach, updateClientMeal);
mealRouter.route('/client/add/:id').post(authToken, isCoach, addMealForClient);
mealRouter.route('/client/targets/:id').get(authToken, isCoach, getClientTargets).put(authToken, isCoach, updateClientTargets);





export default mealRouter;
