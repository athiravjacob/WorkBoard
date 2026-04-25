import { INotificationRepository } from '../../../domain/repositories/INotificationRepository';

export class MarkAllAsReadUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute(userId: string): Promise<void> {
    const notifications = await this.notificationRepository.findByUser(userId, 100, 0); // Limit to last 100 for safety, or implement a bulk update in repo
    const unread = notifications.filter(n => !n.isRead);
    
    for (const notification of unread) {
      notification.markAsRead();
      await this.notificationRepository.update(notification);
    }
    
    // Better: INotificationRepository should have markAllAsRead(userId)
  }
}
