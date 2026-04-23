import { Router } from 'express';
import { userRouter } from '../routes/userRoutes';
import { authRouter } from '../routes/authRoutes';
import { adminRoutes } from '../routes/adminRoutes';

const masterRouter = Router();

masterRouter.use('/users', userRouter);
masterRouter.use('/auth', authRouter);
masterRouter.use('/admin', adminRoutes);

export { masterRouter };