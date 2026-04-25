import { IChatRepository } from '../../../domain/repositories/IChatRepository';
import { Message } from '../../../domain/entities/Chat';
import { IIdGeneratorService } from '../../services/IIdGeneratorService';
import { ConversationNotFoundError, UnauthorizedChatAccessException } from '../../errors/ChatErrors';


export interface SendMessageDTO {
  senderId: string;
  conversationId: string;
  text: string;
}

export class SendMessageUseCase {
  constructor(
    private chatRepository: IChatRepository,
    private idGenerator: IIdGeneratorService
  ) {}

  /**
   * Orchestrates the sending of a chat message.
   * Performs domain validation (Stranger Danger) before persisting the message
   * and updating the conversation pointer.
   */
  async execute(dto: SendMessageDTO): Promise<{ message: Message; conversation: any }> {
    const { senderId, conversationId, text } = dto;

    // Logic Step 1 (Security): Fetch conversation and check participation
    const conversation = await this.chatRepository.findConversationById(conversationId);
    
    if (!conversation) {
      throw new ConversationNotFoundError();
    }

    if (!conversation.hasParticipant(senderId)) {
      throw new UnauthorizedChatAccessException();
    }

    // Logic Step 2 (Persistence): Save
    const message = new Message(
      this.idGenerator.generate(),
      conversationId,
      senderId,
      text,
      false, // isRead starts at false
      new Date()
    );

    const savedMessage = await this.chatRepository.saveMessage(message);

    // Logic Step 3 (Integrity): Update conversation
    await this.chatRepository.updateLastMessage(conversationId, savedMessage.id);

    // Logic Step 4 (Output): Return both for socket handling
    return {
      message: savedMessage,
      conversation
    };
  }
}
