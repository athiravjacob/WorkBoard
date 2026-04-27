import { IMessageDocument } from '../database/models/MessageModel';
import { IConversationDocument } from '../database/models/ConversationModel';
import { Message, Conversation } from '../../domain/entities/Chat';

export class ChatMapper {
  static toMessageDomain(doc: IMessageDocument): Message {
    const senderId = doc.senderId && typeof doc.senderId === 'object' 
        ? (doc.senderId as any)._id || (doc.senderId as any).id 
        : doc.senderId;

    return new Message(
      doc._id.toString(),
      doc.conversationId.toString(),
      senderId.toString(),
      doc.text,
      doc.isRead,
      doc.createdAt,
      (doc as any).senderId && typeof (doc as any).senderId === 'object' ? {
        name: (doc as any).senderId.name,
        avatar: (doc as any).senderId.avatar
      } : undefined
    );
  }

  static toConversationDomain(doc: IConversationDocument): Conversation {
    const participants = doc.participants.map((p: any) => {
        if (typeof p === 'object' && p._id) {
            return {
                id: p._id.toString(),
                name: p.name,
                avatar: p.avatar
            };
        }
        return p; // Just the ID string
    });

    const lastMessage = doc.lastMessage && typeof doc.lastMessage === 'object' && (doc.lastMessage as any)._id
        ? this.toMessageDomain(doc.lastMessage as any)
        : undefined;

    return new Conversation(
      doc._id.toString(),
      participants as any,
      lastMessage,
      doc.updatedAt
    );
  }
}
