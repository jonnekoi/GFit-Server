import express  from 'express';
import {addNewClient, getAllClients} from "../controller/clientController.js";

const clientRouter = express.Router();

clientRouter.route('/').get(getAllClients);
clientRouter.route('/add').post(addNewClient);

export default clientRouter;
