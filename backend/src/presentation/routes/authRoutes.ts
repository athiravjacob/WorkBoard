import { Router } from "express";
import { authController } from "../../infrastructure/config/di";

const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/logout", authController.logout);

export { authRouter };
