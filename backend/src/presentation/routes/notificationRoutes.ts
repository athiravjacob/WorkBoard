import { Router } from 'express';
import { authMiddleware } from '../middlewares/AuthMiddleware';
import { notificationController } from '../../infrastructure/config/di';

const router = Router();

// Protect all notification routes
router.use(authMiddleware);

/**
 * @route   GET /api/notifications
 * @desc    Get paginated notification history for the current user
 */
router.get('/', notificationController.getNotifications);

/**
 * @route   GET /api/notifications/unread-count
 * @desc    Get the count of unread notifications
 */
router.get('/unread-count', notificationController.getUnreadCount);

/**
 * @route   PATCH /api/notifications/read-all
 * @desc    Mark all notifications for the user as read
 */
router.patch('/read-all', notificationController.markAllAsRead);

/**
 * @route   PATCH /api/notifications/:id/read
 * @desc    Mark a specific notification as read
 */
router.patch('/:id/read', notificationController.markAsRead);

export { router as notificationRoutes };
