import { useEffect } from 'react';
import { useNotificationStore } from '../store/useNotificationStore';
import type { Notification } from '../services/notificationService';
import { toast } from 'sonner';
import { useLocation, useNavigate } from 'react-router-dom';
import { NOTIFICATION_EVENTS } from '../constants';
import { getNotificationRedirect } from '../utils/notificationUtils';
import { socketService } from '../../../lib/socketService';

/**
 * Headless hook responsible ONLY for managing real-time notification events.
 * Utilizes the centralized socketService for connection management.
 */
export const useNotificationSocket = () => {
  const { addNotification, incrementUnread } = useNotificationStore.getState();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isAuthPage = ['/login', '/register'].includes(pathname);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || isAuthPage) return;

    socketService.connect(token);

    socketService.on(NOTIFICATION_EVENTS.NEW_NOTIFICATION, (notification: Notification) => {
      console.log('Received real-time notification:', notification);
      
      addNotification(notification);
      incrementUnread();

      toast(notification.senderDetails?.name || 'New Notification', {
        description: notification.message,
        action: {
          label: 'View',
          onClick: () => {
            const path = getNotificationRedirect(notification);
            navigate(path);
          }
        }
      });
    });

    return () => {
      socketService.off(NOTIFICATION_EVENTS.NEW_NOTIFICATION);
      // We don't disconnect here because other features (like Chat) might still need it.
      // Disconnect is handled on logout or app unmount if desired.
    };
  }, [addNotification, incrementUnread, navigate, isAuthPage]);
};
