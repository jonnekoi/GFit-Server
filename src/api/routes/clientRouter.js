import express  from 'express';
import {addNewClient, getAllClients, getClientData} from "../controller/clientController.js";

const clientRouter = express.Router();

clientRouter.route('/').get(getAllClients);
clientRouter.route('/add').post(addNewClient);
clientRouter.route('/:id').get(getClientData);

export default clientRouter;
