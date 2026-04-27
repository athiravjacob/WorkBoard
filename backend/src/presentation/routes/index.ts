import { Router } from 'express';
import { userRouter } from '../routes/userRoutes';
import { authRouter } from '../routes/authRoutes';
import { projectRoutes } from './projectRoutes';
import { taskRoutes } from './taskRoutes';
import { notificationRoutes } from './notificationRoutes';
import { chatRoutes } from './chatRoutes';


const masterRouter = Router();

masterRouter.use('/users', userRouter);
masterRouter.use('/auth', authRouter);
masterRouter.use('/projects', projectRoutes);
masterRouter.use('/tasks', taskRoutes);
masterRouter.use('/notifications', notificationRoutes);
masterRouter.use('/chat', chatRoutes);


export { masterRouter };
