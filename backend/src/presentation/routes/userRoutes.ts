import { Router } from 'express';
import {userController} from '../../infrastructure/config/di'
const userRouter = Router();

userRouter.post('/register', userController.register);

export { userRouter };