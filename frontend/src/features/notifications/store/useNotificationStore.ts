import { create } from 'zustand';
import { notificationService } from '../services/notificationService';
import type { Notification } from '../services/notificationService';


interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  setUnreadCount: (count: number) => void;
  incrementUnread: () => void;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  fetchInitialData: () => Promise<void>;
}


export const useNotificationStore = create<NotificationState>((set) => ({

  notifications: [],
  unreadCount: 0,

  setNotifications: (notifications) => set({ notifications }),

  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications]
  })),

  setUnreadCount: (count) => set({ unreadCount: count }),

  incrementUnread: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),

  markAsRead: async (id) => {
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
      // Revert if API fails (optional, but good practice)
      console.error('Failed to mark notification as read:', error);
      // In a real app, you might want to refetch the data here
    }
  },

  markAllAsRead: async () => {
    // Optimistic update
    set((state) => ({
      notifications: state.notifications.map((notif) => ({ ...notif, isRead: true })),
      unreadCount: 0
    }));

    try {
      await notificationService.markAllAsRead();
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  },

  fetchInitialData: async () => {

    try {
      const [notifications, unreadCount] = await Promise.all([
        notificationService.getNotifications(),
        notificationService.getUnreadCount()
      ]);
      set({ notifications, unreadCount });
    } catch (error) {
      console.error('Failed to fetch initial notifications:', error);
    }
  }
}));
