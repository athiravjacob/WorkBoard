import { Notification } from '../../domain/entities/Notification';
import { INotificationDocument } from '../database/models/NotificationModel';

export class NotificationMapper {
  /**
   * Converts a Mongoose document to a Domain Notification entity.
   * Supports populated senderId to include sender details.
   */
  public static toDomain(doc: INotificationDocument): Notification {
    const isSenderPopulated = typeof doc.senderId === 'object' && doc.senderId !== null;
    
    // Extract ID and details if populated
    const senderId = isSenderPopulated 
      ? (doc.senderId as any)._id 
      : doc.senderId;

    const senderDetails = isSenderPopulated ? {
      name: (doc.senderId as any).name,
      avatar: (doc.senderId as any).avatar
    } : undefined;

    return new Notification(
      doc._id,
      doc.recipientId,
      senderId,
      doc.type,
      doc.relatedId,
      doc.message,
      doc.isRead,
      doc.createdAt,
      senderDetails
    );
  }

  /**
   * Converts a Domain Notification entity to a persistence object.
   */
  public static toPersistence(notification: Notification): any {
    return {
      _id: notification.id,
      recipientId: notification.recipientId,
      senderId: notification.senderId,
      type: notification.type,
      relatedId: notification.relatedId,
      message: notification.message,
      isRead: notification.isRead
    };
  }
}
