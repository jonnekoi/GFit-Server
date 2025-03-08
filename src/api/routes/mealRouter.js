import express  from 'express';
import authToken from "../../utils/middlewares.js";
import getAllMeals from "../controller/mealController.js";

const mealRouter = express.Router();



mealRouter.route('/').get(getAllMeals);





export default mealRouter;
