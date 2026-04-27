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
   * Finds a 1-on-1 conversation by participant IDs.
   */
  findConversationByParticipants(participants: string[]): Promise<Conversation | null>;

  /**
   * Creates a new conversation.
   */
  createConversation(id: string, participants: string[]): Promise<Conversation>;

  /**
   * Finds all conversations for a specific user.
   */
  findConversationsByUserId(userId: string): Promise<Conversation[]>;

  /**
   * Retrieves all messages for a specific conversation.
   */
  findMessagesByConversationId(conversationId: string): Promise<Message[]>;

  /**
   * Updates the last message reference and updatedAt timestamp of a conversation.
   */
  updateLastMessage(conversationId: string, messageId: string): Promise<void>;
}
