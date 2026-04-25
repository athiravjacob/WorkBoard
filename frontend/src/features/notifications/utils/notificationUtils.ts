import { NOTIFICATION_TYPES } from '../constants';
import type { Notification } from '../services/notificationService';

/**
 * Returns the appropriate redirect path for a given notification.
 * Decouples navigation logic from UI components.
 */
export const getNotificationRedirect = (notification: Notification): string => {
  switch (notification.type) {
    case NOTIFICATION_TYPES.PROJECT_ASSIGNED:
      return `/projects/${notification.relatedId}`;
    
    case NOTIFICATION_TYPES.TASK_ASSIGNED:
    case NOTIFICATION_TYPES.STATUS_REVIEW:
    case NOTIFICATION_TYPES.STATUS_UPDATED:
      return '/tasks'; // Ideal: Could redirect to specific task modal/page if implemented
      
    default:
      return '/dashboard';
  }
};

/**
 * Centralized formatting for notification messages if needed in the future.
 */
export const formatNotificationMessage = (notification: Notification): string => {
  return notification.message;
};
