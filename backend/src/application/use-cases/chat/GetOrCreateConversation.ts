import { IChatRepository } from '../../../domain/repositories/IChatRepository';
import { Conversation } from '../../../domain/entities/Chat';

export interface GetOrCreateConversationDTO {
  currentUserId: string;
  targetUserId: string;
}

export class GetOrCreateConversation {
  constructor(
    private chatRepository: IChatRepository
  ) {}

  async execute(dto: GetOrCreateConversationDTO): Promise<Conversation> {
    const { currentUserId, targetUserId } = dto;

    if (currentUserId === targetUserId) {
      throw new Error('You cannot start a conversation with yourself');
    }

    // Sort participants to ensure consistent 1-on-1 identification
    const participants = [currentUserId, targetUserId].sort();
    const existingConversation = await this.chatRepository.findConversationByParticipants(participants);

    if (existingConversation) {
      return existingConversation;
    }

    // Create new conversation
    // Passing empty string for id as it's ignored by Mongoose now, but maintains interface parity
    return await this.chatRepository.createConversation('', participants);
  }
}
