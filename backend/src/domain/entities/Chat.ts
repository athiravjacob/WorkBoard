export interface MessageSenderDetails {
  name: string;
  avatar?: string;
}

export class Message {

  constructor(
    public readonly id: string,
    public readonly conversationId: string,
    public readonly senderId: string,
    public readonly text: string,
    public readonly isRead: boolean,
    public readonly createdAt: Date,
    public readonly senderDetails?: MessageSenderDetails
  ) {}
}


export class Conversation {
  constructor(
    public readonly id: string,
    public readonly participants: string[],
    public readonly lastMessageId?: string,
    public readonly updatedAt?: Date
  ) {}

  /**
   * Domain Logic: Stranger Danger check.
   * Ensures a user belongs to this specific conversation.
   */
  public hasParticipant(userId: string): boolean {
    return this.participants.includes(userId);
  }
}

