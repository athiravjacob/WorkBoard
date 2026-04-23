import { Router } from 'express';
import { userRouter } from '../routes/userRoutes';
import { authRouter } from '../routes/authRoutes';
import { projectRoutes } from './projectRoutes';

const masterRouter = Router();

masterRouter.use('/users', userRouter);
masterRouter.use('/auth', authRouter);
masterRouter.use('/projects', projectRoutes);

export { masterRouter };
