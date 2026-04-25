import { Message, Conversation } from '../entities/Chat';

export interface IChatRepository {
  /**
   * Persists a new message to the database.
   */
  saveMessage(message: Message): Promise<Message>;

  /**
   * Retrieves a conversation by its unique ID.
   */
  findConversationById(id: string): Promise<Conversation | null>;

  /**
   * Updates the last message reference and updatedAt timestamp of a conversation.
   */
  updateLastMessage(conversationId: string, messageId: string): Promise<void>;
}
