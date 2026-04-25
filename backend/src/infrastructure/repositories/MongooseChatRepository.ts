import { IChatRepository } from '../../domain/repositories/IChatRepository';
import { Message, Conversation } from '../../domain/entities/Chat';
import { MessageModel } from '../database/models/MessageModel';
import { ConversationModel } from '../database/models/ConversationModel';
import { Types } from 'mongoose';

export class MongooseChatRepository implements IChatRepository {
  async saveMessage(message: Message): Promise<Message> {
    const persistence = {
      _id: message.id,
      conversationId: new Types.ObjectId(message.conversationId),
      senderId: new Types.ObjectId(message.senderId),
      text: message.text,
      isRead: message.isRead,
      createdAt: message.createdAt,
    };

    const doc = await MessageModel.create(persistence);
    const populated = await MessageModel.findById(doc._id).populate('senderId', 'name avatar').exec();
    
    return new Message(
      populated!._id.toString(),
      populated!.conversationId.toString(),
      populated!.senderId._id.toString(),
      populated!.text,
      populated!.isRead,
      populated!.createdAt,
      {
        name: (populated!.senderId as any).name,
        avatar: (populated!.senderId as any).avatar
      }
    );
  }

  async findConversationById(id: string): Promise<Conversation | null> {
    const doc = await ConversationModel.findById(id).exec();
    if (!doc) return null;

    return new Conversation(
      doc._id.toString(),
      doc.participants.map(p => p.toString()),
      doc.lastMessage?.toString(),
      doc.updatedAt
    );
  }

  async updateLastMessage(conversationId: string, messageId: string): Promise<void> {
    await ConversationModel.findByIdAndUpdate(conversationId, {
      lastMessage: new Types.ObjectId(messageId)
    }).exec();
  }
}
