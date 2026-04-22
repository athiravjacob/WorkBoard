import { Router } from 'express';
import { userRouter } from '../routes/userRoutes';

const masterRouter = Router();

masterRouter.use('/users', userRouter);



export { masterRouter };