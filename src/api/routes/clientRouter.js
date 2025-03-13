import express  from 'express';
import {
    addNewClient,
    getAllClients,
    getClientData,
    getClientWeights,
    setClientWorkout,
    updateClientWorkout
} from "../controller/clientController.js";
import authToken from "../../utils/middlewares.js";

const isCoach = (req, res, next) => {
    if (res.locals.user.access === 'coach') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied' });
    }
};


const clientRouter = express.Router();

clientRouter.route('/').get(authToken, isCoach, getAllClients);
clientRouter.route('/add').post(authToken, isCoach, addNewClient);
clientRouter.route('/:id').get(authToken, isCoach, getClientData);
clientRouter.route('/weight/:id').get(authToken, isCoach, getClientWeights);
clientRouter.route('/workout/client/add').post(authToken, isCoach, setClientWorkout).put(authToken, isCoach, updateClientWorkout);
export default clientRouter;
