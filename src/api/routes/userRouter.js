import express  from 'express';
import {registerUser, loginUser, uploadProfilePicture, getProfilePicture} from '../controller/userController.js';
import multer from "multer";

const userRouter = express.Router();
const upload = multer({ dest: 'uploads/' });


userRouter.route('/register').post(registerUser);
userRouter.route('/login').post(loginUser);
userRouter.route('/uploadProfilePicture').post(upload.single('profilePicture'), uploadProfilePicture);
userRouter.route('/profilePicture/:filename').get(getProfilePicture);




export default userRouter;
