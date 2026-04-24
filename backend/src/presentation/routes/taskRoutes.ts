import { Router } from 'express';
import { authMiddleware } from '../middlewares/AuthMiddleware';
import { roleMiddleware } from '../middlewares/RoleMiddleware';
import { UserRole } from '../../domain/entities/User';
import { taskController } from '../../infrastructure/config/di';

const router = Router();

// 🔐 Protect all task routes with authentication
router.use(authMiddleware);

/**
 * @route   GET /api/tasks/me
 * @desc    Get all tasks assigned to the currently logged-in user
 */
router.get(
    "/me", 
    taskController.getMyTasks
);

export { router as taskRoutes };
