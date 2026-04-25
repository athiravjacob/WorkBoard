import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMessageDocument extends Document {
  conversationId: Types.ObjectId;
  senderId: Types.ObjectId;
  text: string;
  isRead: boolean;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessageDocument>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Indexes for performance
MessageSchema.index({ conversationId: 1, createdAt: -1 });

export const MessageModel = mongoose.model<IMessageDocument>('Message', MessageSchema);
