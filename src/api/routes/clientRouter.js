import express  from 'express';
import {addNewClient, getAllClients, getClientData, getClientWeights} from "../controller/clientController.js";
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
clientRouter.route('/add').post(addNewClient);
clientRouter.route('/:id').get(getClientData);
clientRouter.route('/weight/:id').get(getClientWeights);

export default clientRouter;
