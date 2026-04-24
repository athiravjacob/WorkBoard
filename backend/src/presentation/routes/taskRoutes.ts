import { Router } from 'express';
import { authMiddleware } from '../middlewares/AuthMiddleware';
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

/**
 * @route   PATCH /api/tasks/:taskId/status
 * @desc    Update the status of a specific task
 */
router.patch(
    "/:taskId/status",
    taskController.updateStatus
);

/**
 * @route   POST /api/tasks/:taskId/notes
 * @desc    Add a progress note to a task
 */
router.post(
    "/:taskId/notes",
    taskController.addTaskNote
);

export { router as taskRoutes };
