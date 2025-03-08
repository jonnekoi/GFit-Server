import express from "express";
import "dotenv";
import userRouter from './routes/userRouter.js';
import workoutRouter from "./routes/workoutRouter.js";
import clientRouter from "./routes/clientRouter.js";
import mealRouter from "./routes/mealRouter.js";

const router = express.Router();


router.use("/users", userRouter);
router.use("/workouts", workoutRouter);
router.use("/clients", clientRouter);
router.use("/meals", mealRouter);
export default router;
