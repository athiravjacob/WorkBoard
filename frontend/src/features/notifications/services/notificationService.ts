import api from "../../../lib/axios";
import { NOTIFICATION_API_ROUTES } from "../constants";

export interface NotificationSenderDetails {
  name: string;
  avatar?: string;
}

export interface Notification {
  id: string;
  recipientId: string;
  senderId: string;
  type: string;
  relatedId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  senderDetails?: NotificationSenderDetails;
}

export const notificationService = {
  getNotifications: async (limit = 20, skip = 0): Promise<Notification[]> => {
    const response = await api.get(NOTIFICATION_API_ROUTES.BASE, {
      params: { limit, skip }
    });
    return response.data;
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await api.get(NOTIFICATION_API_ROUTES.UNREAD_COUNT);
    return response.data.count;
  },

  markAsRead: async (id: string): Promise<void> => {
    await api.patch(NOTIFICATION_API_ROUTES.MARK_READ(id));
  },

  markAllAsRead: async (): Promise<void> => {
    await api.patch(NOTIFICATION_API_ROUTES.MARK_ALL_READ);
  }
};
