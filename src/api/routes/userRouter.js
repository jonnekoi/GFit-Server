import express  from 'express';
import {registerUser} from '../controller/userController.js';

const userRouter = express.Router();

userRouter.route('/register').post(registerUser);

export default userRouter;
