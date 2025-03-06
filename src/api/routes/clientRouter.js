import express  from 'express';
import {addNewClient, getAllClients, getClientData, getClientWeights} from "../controller/clientController.js";

const clientRouter = express.Router();

clientRouter.route('/').get(getAllClients);
clientRouter.route('/add').post(addNewClient);
clientRouter.route('/:id').get(getClientData);
clientRouter.route('/weight/:id').get(getClientWeights);

export default clientRouter;
