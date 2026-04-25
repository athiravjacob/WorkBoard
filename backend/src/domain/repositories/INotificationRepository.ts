import { Notification } from '../entities/Notification';

export interface INotificationRepository {
  save(notification: Notification): Promise<void>;
  findById(id: string): Promise<Notification | null>;
  findByUser(userId: string, limit: number, skip: number): Promise<Notification[]>;
  getUnreadCount(userId: string): Promise<number>;
  update(notification: Notification): Promise<void>;
}
