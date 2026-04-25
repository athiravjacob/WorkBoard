import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useNotificationStore } from '../store/useNotificationStore';
import type { Notification } from '../services/notificationService';
import { toast } from 'sonner';
import { useLocation, useNavigate } from 'react-router-dom';

const SOCKET_URL = 'http://localhost:5000'; // Should be in env in real app

export const useNotificationSocket = () => {
  const { addNotification, incrementUnread, fetchInitialData } = useNotificationStore.getState();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isAuthPage = ['/login', '/register'].includes(pathname);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || isAuthPage) return;

    fetchInitialData();
  }, [fetchInitialData, isAuthPage]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || isAuthPage) return;

    const socket: Socket = io(SOCKET_URL, {
      auth: { token }
    });

    socket.on('connect', () => {
      console.log('Socket connected for real-time notifications');
    });

    socket.on('NEW_NOTIFICATION', (notification: Notification) => {
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
            // Logic for redirecting based on type
            if (notification.type === 'PROJECT_ASSIGNED') {
              navigate(`/projects/${notification.relatedId}`);
            } else {
              // Default to tasks list or project context if applicable
              navigate('/tasks');
            }
          }
        }
      });
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return () => {
      socket.off('NEW_NOTIFICATION');
      socket.disconnect();
    };
  }, [addNotification, incrementUnread, navigate]);
};
