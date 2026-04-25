export class ConversationNotFoundError extends Error {
  constructor() {
    super('Conversation not found');
    this.name = 'ConversationNotFoundError';
  }
}

export class UnauthorizedChatAccessException extends Error {
  constructor() {
    super('Unauthorized access to this chat. Stranger Danger!');
    this.name = 'UnauthorizedChatAccessException';
  }
}
