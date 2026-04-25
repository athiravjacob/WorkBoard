import { create } from 'zustand';
import { notificationService } from '../services/notificationService';
import type { Notification } from '../services/notificationService';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  setUnreadCount: (count: number) => void;
  incrementUnread: () => void;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  fetchInitialData: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  setNotifications: (notifications) => set({ notifications }),

  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications]
  })),

  setUnreadCount: (count) => set({ unreadCount: count }),

  incrementUnread: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),

  markAsRead: async (id) => {
    const prevState = get();
    
    // Optimistic update
    set((state) => ({
      notifications: state.notifications.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      ),
      unreadCount: Math.max(0, state.unreadCount - 1)
    }));

    try {
      await notificationService.markAsRead(id);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      // Rollback on failure
      set({ 
        notifications: prevState.notifications,
        unreadCount: prevState.unreadCount,
        error: 'Failed to sync read status with server'
      });
    }
  },

  markAllAsRead: async () => {
    const prevState = get();
    
    // Optimistic update
    set((state) => ({
      notifications: state.notifications.map((notif) => ({ ...notif, isRead: true })),
      unreadCount: 0
    }));

    try {
      await notificationService.markAllAsRead();
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      // Rollback on failure
      set({ 
        notifications: prevState.notifications,
        unreadCount: prevState.unreadCount,
        error: 'Failed to mark all as read'
      });
    }
  },

  fetchInitialData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [notifications, unreadCount] = await Promise.all([
        notificationService.getNotifications(),
        notificationService.getUnreadCount()
      ]);
      set({ notifications, unreadCount, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch initial notifications:', error);
      set({ isLoading: false, error: 'Failed to load notifications' });
    }
  }
}));
