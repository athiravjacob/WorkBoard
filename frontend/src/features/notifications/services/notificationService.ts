import api from "../../../lib/axios";


export interface Notification {
  id: string;
  recipientId: string;
  senderId: string;
  type: string;
  relatedId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  senderDetails?: {
    name: string;
    avatar?: string;
  };
}

export const notificationService = {
  getNotifications: async (limit = 20, skip = 0): Promise<Notification[]> => {
    const response = await api.get(`/notifications?limit=${limit}&skip=${skip}`);
    return response.data;
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await api.get("/notifications/unread-count");
    return response.data.count;
  },

  markAsRead: async (id: string): Promise<void> => {
    await api.patch(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await api.patch('/notifications/read-all');
  }
};

