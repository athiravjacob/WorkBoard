import { INotificationRepository } from '../../../domain/repositories/INotificationRepository';

export class GetUnreadCountUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute(userId: string): Promise<number> {
    return await this.notificationRepository.getUnreadCount(userId);
  }
}
