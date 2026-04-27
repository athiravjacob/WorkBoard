import { IChatRepository } from '../../../domain/repositories/IChatRepository';
import { Message } from '../../../domain/entities/Chat';
import { ConversationNotFoundError, UnauthorizedChatAccessException } from '../../errors/ChatErrors';


export interface SendMessageDTO {
  senderId: string;
  conversationId: string;
  text: string;
}

export class SendMessageUseCase {
  constructor(
    private chatRepository: IChatRepository
  ) {}

  /**
   * Orchestrates the sending of a chat message.
   * Performs domain validation (Stranger Danger) before persisting the message
   * and updating the conversation pointer.
   */
  async execute(dto: SendMessageDTO): Promise<{ message: Message; conversation: any }> {
    const { senderId, conversationId, text } = dto;

    const conversation = await this.chatRepository.findConversationById(conversationId);
    
    if (!conversation) {
      throw new ConversationNotFoundError();
    }

    if (!conversation.hasParticipant(senderId)) {
      throw new UnauthorizedChatAccessException();
    }

    const message = new Message(
      '', // MongoDB will generate the ObjectId
      conversationId,
      senderId,
      text,
      false,
      new Date()
    );

    const savedMessage = await this.chatRepository.saveMessage(message);
    await this.chatRepository.updateLastMessage(conversationId, savedMessage.id);
    
    return {
      message: savedMessage,
      conversation
    };
  }
}
