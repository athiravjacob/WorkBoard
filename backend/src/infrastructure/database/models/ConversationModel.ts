import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IConversationDocument extends Document {
  participants: Types.ObjectId[];
  lastMessage?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversationDocument>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
    },
  },
  {
    timestamps: true,
  }
);

// Index to quickly find conversations for a user
ConversationSchema.index({ participants: 1 });

export const ConversationModel = mongoose.model<IConversationDocument>('Conversation', ConversationSchema);
