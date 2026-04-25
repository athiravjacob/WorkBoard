import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useNotificationStore } from '../store/useNotificationStore';
import type { Notification } from '../services/notificationService';
import { toast } from 'sonner';
import { useLocation, useNavigate } from 'react-router-dom';
import { NOTIFICATION_EVENTS } from '../constants';
import { getNotificationRedirect } from '../utils/notificationUtils';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

/**
 * Headless hook responsible ONLY for managing the Socket.io connection and real-time events.
 */
export const useNotificationSocket = () => {
  // Use getState for stability in event handlers without triggering re-renders of the host component
  const { addNotification, incrementUnread } = useNotificationStore.getState();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isAuthPage = ['/login', '/register'].includes(pathname);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || isAuthPage) return;

    const socket: Socket = io(SOCKET_URL, {
      auth: { token }
    });

    socket.on('connect', () => {
      console.log('Socket connected for real-time notifications');
    });

    socket.on(NOTIFICATION_EVENTS.NEW_NOTIFICATION, (notification: Notification) => {
      console.log('Received real-time notification:', notification);
      
      // Update Store
      addNotification(notification);
      incrementUnread();

      // Trigger Sonner Toast
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

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return () => {
      socket.off(NOTIFICATION_EVENTS.NEW_NOTIFICATION);
      socket.disconnect();
    };
  }, [addNotification, incrementUnread, navigate, isAuthPage]);
};
