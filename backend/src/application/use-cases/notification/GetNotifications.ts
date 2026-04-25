import { INotificationRepository } from '../../../domain/repositories/INotificationRepository';
import { Notification } from '../../../domain/entities/Notification';

export class GetNotificationsUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute(userId: string, limit: number = 20, skip: number = 0): Promise<Notification[]> {
    return await this.notificationRepository.findByUser(userId, limit, skip);
  }
}
