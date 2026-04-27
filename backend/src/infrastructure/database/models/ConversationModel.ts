import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IConversationDocument extends Document {
  participants: string[];
  lastMessage?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema: Schema = new Schema(
  {
    participants: [
      {
        type: String,
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

// Index for performance
ConversationSchema.index({ participants: 1 });

export const ConversationModel = mongoose.model<IConversationDocument>('Conversation', ConversationSchema);
