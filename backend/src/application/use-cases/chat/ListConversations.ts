import { IChatRepository } from '../../../domain/repositories/IChatRepository';
import { Message, ParticipantDetails } from '../../../domain/entities/Chat';

export interface ConversationParticipantDTO {
  id: string;
  name: string;
  avatar?: string;
}

export interface ConversationDTO {
  id: string;
  participants: ConversationParticipantDTO[];
  lastMessage?: Message;
  updatedAt?: Date;
}

export class ListConversations {
  constructor(private chatRepository: IChatRepository) {}

  async execute(userId: string): Promise<ConversationDTO[]> {
    const conversations = await this.chatRepository.findConversationsByUserId(userId);

    return conversations.map(conv => {
      // Access populated details (assigned in MongooseChatRepository and mapped in ChatMapper)
      const allParticipants = conv.participants as ParticipantDetails[];
      
      // Filter out the current user to satisfy "Ensure the participants array in the response excludes the current user"
      const otherParticipants = allParticipants.filter(p => String(p.id) !== String(userId));

      return {
        id: conv.id,
        participants: otherParticipants,
        lastMessage: conv.lastMessage,
        updatedAt: conv.updatedAt
      };
    });
  }
}
