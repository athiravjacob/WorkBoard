import { Router } from 'express';
import { userRouter } from '../routes/userRoutes';
import { authRouter } from '../routes/authRoutes';
import { projectRoutes } from './projectRoutes';
import { taskRoutes } from './taskRoutes';

const masterRouter = Router();

masterRouter.use('/users', userRouter);
masterRouter.use('/auth', authRouter);
masterRouter.use('/projects', projectRoutes);
masterRouter.use('/tasks', taskRoutes);

export { masterRouter };
