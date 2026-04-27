import api from "../../../lib/axios";

export interface ChatParticipant {
  id: string;
  name: string;
  avatar?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  isRead: boolean;
  createdAt: string;
  status? : 'sending' | 'sent' | 'error';
  senderDetails?: {
    name: string;
    avatar?: string;
  };
}

export interface Conversation {
  id: string;
  participants: ChatParticipant[];
  lastMessage?: Message;
  updatedAt: string;
  unreadCount?: number;
}

export const chatService = {
  fetchConversations: async (): Promise<Conversation[]> => {
    const response = await api.get('/chat/conversations');
    return response.data;
  },

  fetchMessages: async (conversationId: string): Promise<Message[]> => {
    console.log(conversationId)
    const response = await api.get(`/chat/conversations/${conversationId}/messages`);
    console.log(response)
    return response.data;
  },

  startConversation: async (targetUserId: string): Promise<Conversation> => {
    const response = await api.post('/chat/conversations', { targetUserId });
    return response.data;
  }
};
