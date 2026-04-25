import { INotificationRepository } from '../../../domain/repositories/INotificationRepository';

export class MarkAsReadUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute(notificationId: string, userId: string): Promise<void> {
    const notification = await this.notificationRepository.findById(notificationId);
    
    if (!notification) {
      throw new Error('Notification not found');
    }

    if (notification.recipientId !== userId) {
      throw new Error('Unauthorized: You can only mark your own notifications as read');
    }

    notification.markAsRead();
    await this.notificationRepository.update(notification);
  }
}
