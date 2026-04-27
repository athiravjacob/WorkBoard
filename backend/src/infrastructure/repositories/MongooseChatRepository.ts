import { IChatRepository } from '../../domain/repositories/IChatRepository';
import { Message, Conversation } from '../../domain/entities/Chat';
import { MessageModel } from '../database/models/MessageModel';
import { ConversationModel } from '../database/models/ConversationModel';
import { Types } from 'mongoose';
import { ChatMapper } from '../mappers/ChatMapper';

export class MongooseChatRepository implements IChatRepository {
  async saveMessage(message: Message): Promise<Message> {
    const persistence = {
      conversationId: new Types.ObjectId(message.conversationId),
      senderId: message.senderId,
      text: message.text,
      isRead: message.isRead,
      createdAt: message.createdAt,
    };

    const doc = await MessageModel.create(persistence);
    const populated = await MessageModel.findById(doc._id)
      .populate('senderId', 'name avatar')
      .lean()
      .exec();
    
    return ChatMapper.toMessageDomain(populated as any);
  }

  async findConversationById(id: string): Promise<Conversation | null> {
    const doc = await ConversationModel.findById(id)
      .populate('participants', 'name avatar')
      .populate({
        path: 'lastMessage',
        populate: { path: 'senderId', select: 'name avatar' }
      })
      .lean()
      .exec();

    if (!doc) return null;
    return ChatMapper.toConversationDomain(doc as any);
  }

  async findConversationByParticipants(participants: string[]): Promise<Conversation | null> {
    const doc = await ConversationModel.findOne({
      participants: { $all: participants, $size: participants.length }
    })
    .populate('participants', 'name avatar')
    .populate({
      path: 'lastMessage',
      populate: { path: 'senderId', select: 'name avatar' }
    })
    .lean()
    .exec();

    if (!doc) return null;
    return ChatMapper.toConversationDomain(doc as any);
  }

  async createConversation(id: string, participants: string[]): Promise<Conversation> {
    // Note: id is ignored as MongoDB generates ObjectIds now, but kept for interface compatibility
    const doc = await ConversationModel.create({
      participants: participants
    });

    const populated = await ConversationModel.findById(doc._id)
      .populate('participants', 'name avatar')
      .lean()
      .exec();
    return ChatMapper.toConversationDomain(populated as any);
  }

  async findConversationsByUserId(userId: string): Promise<Conversation[]> {
    const docs = await ConversationModel.find({
      participants: userId
    })
    .sort({ updatedAt: -1 })
    .populate('participants', 'name avatar')
    .populate({
      path: 'lastMessage',
      populate: { path: 'senderId', select: 'name avatar' }
    })
    .lean()
    .exec();

    return docs.map(doc => ChatMapper.toConversationDomain(doc as any));
  }

  async findMessagesByConversationId(conversationId: string): Promise<Message[]> {
    const docs = await MessageModel.find({
      conversationId: new Types.ObjectId(conversationId)
    })
    .sort({ createdAt: 1 })
    .populate('senderId', 'name avatar')
    .lean()
    .exec();

    return docs.map(doc => ChatMapper.toMessageDomain(doc as any));
  }

  async updateLastMessage(conversationId: string, messageId: string): Promise<void> {
    await ConversationModel.findByIdAndUpdate(conversationId, {
      lastMessage: new Types.ObjectId(messageId)
    }).exec();
  }
}
