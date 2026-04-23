import { Router } from "express";
import { userController } from "../../infrastructure/config/di";
const userRouter = Router();

userRouter.get('/', userController.getAllUsers);
userRouter.get('/me', userController.getMyProfile);

export { userRouter };
