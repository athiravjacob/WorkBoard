import { INotificationRepository } from '../../domain/repositories/INotificationRepository';
import { Notification } from '../../domain/entities/Notification';
import { NotificationModel } from '../database/models/NotificationModel';
import { NotificationMapper } from '../mappers/NotificationMapper';

export class MongooseNotificationRepository implements INotificationRepository {
  async save(notification: Notification): Promise<void> {
    const persistence = NotificationMapper.toPersistence(notification);
    await NotificationModel.create(persistence);
  }

  async findById(id: string): Promise<Notification | null> {
    const doc = await NotificationModel.findById(id).populate('senderId');
    if (!doc) return null;
    return NotificationMapper.toDomain(doc);
  }

  async findByUser(userId: string, limit: number, skip: number): Promise<Notification[]> {
    const docs = await NotificationModel.find({ recipientId: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('senderId');
    
    return docs.map(doc => NotificationMapper.toDomain(doc));
  }

  async getUnreadCount(userId: string): Promise<number> {
    return await NotificationModel.countDocuments({ recipientId: userId, isRead: false });
  }

  async update(notification: Notification): Promise<void> {
    const persistence = NotificationMapper.toPersistence(notification);
    await NotificationModel.findByIdAndUpdate(notification.id, persistence);
  }
}
