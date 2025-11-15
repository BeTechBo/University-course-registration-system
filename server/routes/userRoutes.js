import express from 'express';
import { getUserData } from '../controllers/userController.js';
import userAuth from '../middleware/userAuth.js';

const userRouter = express.Router();

// Existing route
userRouter.get('/data', userAuth, getUserData);

export default userRouter;
