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


export interface ParticipantDetails {
  id: string;
  name: string;
  avatar?: string;
}

export class Conversation {
  constructor(
    public readonly id: string,
    public readonly participants: (string | ParticipantDetails)[],
    public readonly lastMessage?: Message,
    public readonly updatedAt?: Date
  ) {}

  /**
   * Domain Logic: Stranger Danger check.
   * Ensures a user belongs to this specific conversation.
   * Handles both raw IDs and populated participant objects.
   */
  public hasParticipant(userId: string): boolean {
    return this.participants.some(p => {
      if (typeof p === 'string') return p === userId;
      return (p as any).id === userId;
    });
  }
}

