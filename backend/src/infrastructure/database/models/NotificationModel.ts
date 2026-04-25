import mongoose, { Schema, Document } from 'mongoose';
import { NotificationType } from '../../../domain/entities/Notification';

export interface INotificationDocument extends Document<string> {
  _id: string;
  recipientId: string;
  senderId: string;
  type: NotificationType;
  relatedId: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotificationDocument>(
  {
    _id: { type: String, required: true },
    // Using String for IDs to remain consistent with the rest of the application's UUID-based ID system.
    // ref: 'User' still allows for population since the User model also uses String for its _id.
    recipientId: { type: String, ref: 'User', required: true, index: true },
    senderId: { type: String, ref: 'User', required: true },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true
    },
    relatedId: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false }
  },
  { 
    timestamps: true,
    versionKey: false 
  }
);

export const NotificationModel = mongoose.model<INotificationDocument>('Notification', NotificationSchema);
