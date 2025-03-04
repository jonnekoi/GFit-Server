import express from "express";
import "dotenv";
import userRouter from './routes/userRouter.js';
import workoutRouter from "./routes/workoutRouter.js";

const router = express.Router();

router.use("/users", userRouter);
router.use("/workouts", workoutRouter);
export default router;
