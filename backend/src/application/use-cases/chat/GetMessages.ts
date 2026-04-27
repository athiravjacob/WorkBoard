import { IChatRepository } from '../../../domain/repositories/IChatRepository';
import { Message } from '../../../domain/entities/Chat';
import { ConversationNotFoundError, UnauthorizedChatAccessException } from '../../errors/ChatErrors';

export class GetMessages {
  constructor(private chatRepository: IChatRepository) {}

  async execute(conversationId: string, currentUserId: string): Promise<Message[]> {
    const conversation = await this.chatRepository.findConversationById(conversationId);
    
    if (!conversation) {
      throw new ConversationNotFoundError();
    }

    if (!conversation.hasParticipant(currentUserId)) {
      throw new UnauthorizedChatAccessException();
    }

    return await this.chatRepository.findMessagesByConversationId(conversationId);
  }
}
