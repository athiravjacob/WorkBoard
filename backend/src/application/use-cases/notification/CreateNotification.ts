import { INotificationRepository } from '../../../domain/repositories/INotificationRepository';
import { Notification, NotificationType } from '../../../domain/entities/Notification';
import { IIdGeneratorService } from '../../services/IIdGeneratorService';

export interface CreateNotificationDTO {
  recipientId: string;
  senderId: string;
  type: NotificationType;
  relatedId: string;
  message: string;
}

export class CreateNotificationUseCase {
  constructor(
    private notificationRepository: INotificationRepository,
    private idGenerator: IIdGeneratorService
  ) {}

  async execute(dto: CreateNotificationDTO): Promise<Notification | void> {

    // Self-Check: Prevent users from notifying themselves
    if (dto.senderId === dto.recipientId) {
      console.log('Skipping notification: Sender and Recipient are the same.');
      return;
    }

    const notification = new Notification(
      this.idGenerator.generate(),
      dto.recipientId,
      dto.senderId,
      dto.type,
      dto.relatedId,
      dto.message,
      false,
      new Date()
    );

    await this.notificationRepository.save(notification);
    return notification;
  }
}
