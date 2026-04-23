import { Router } from "express";
import { userController } from "../../infrastructure/config/di";
const userRouter = Router();
userRouter.get("/test", (req, res) => {
  res.send("User route working");
});

export { userRouter };
