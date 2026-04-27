import { create } from 'zustand';
import { chatService } from '../services/chatService';
import type { Conversation, Message } from '../services/chatService';

interface ChatState {
  conversations: Conversation[];
  messages: Message[];
  activeChatId: string | null;
  isLoading: boolean;
  isSelectingUser: boolean;
  
  // Actions
  setConversations: (data: Conversation[]) => void;
  setActiveChat: (id: string | null) => void;
  setIsSelectingUser: (value: boolean) => void;
  setMessages: (data: Message[]) => void;
  receiveNewMessage: (message: Message) => void;
  optimisticSendMessage: (message: Message) => void;
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  startNewChat: (targetUserId: string) => Promise<void>;
  handleMessageError: (conversationId: string, text: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  messages: [],
  activeChatId: null,
  isLoading: false,
  isSelectingUser: false,

  setConversations: (conversations) => set({ conversations }),
  
  setIsSelectingUser: (isSelectingUser) => set({ isSelectingUser }),

  setMessages: (messages) => set({ messages }),

  setActiveChat: (id) => {
    set({ activeChatId: id, messages: [] });
    if (id) {
       get().fetchMessages(id);
    }
  },

  receiveNewMessage: (message) => {
    const { activeChatId, conversations, messages } = get();

    // 1. If message belongs to active chat, handle deduplication and append
    if (message.conversationId === activeChatId) {
      // Check if this message was sent by us and matches a 'sending' message
      const existingMessageIndex = messages.findIndex(m => 
        m.status === 'sending' && 
        String(m.senderId) === String(message.senderId) && 
        m.text === message.text
      );

      if (existingMessageIndex !== -1) {
        // REPLACE the optimistic message with the real one from the server (removes infinite spinner)
        const updatedMessages = [...messages];
        updatedMessages[existingMessageIndex] = message;
        set({ messages: updatedMessages });
      } else {
        // Prevent pure duplicates from multiple socket events
        const isDuplicate = messages.some(m => m.id === message.id);
        if (!isDuplicate) {
          set({ messages: [...messages, message] });
        }
      }
    }

    // 2. Inbox Logic: Update lastMessage and move conversation to top
    const conversationIndex = conversations.findIndex(c => c.id === message.conversationId);
    
    if (conversationIndex !== -1) {
      const updatedConversations = [...conversations];
      const conversation = { ...updatedConversations[conversationIndex] };
      
      conversation.lastMessage = message;
      conversation.updatedAt = message.createdAt;
      
      // Update unread count locally if it's not the active chat
      if (message.conversationId !== activeChatId) {
        conversation.unreadCount = (conversation.unreadCount || 0) + 1;
      }

      // Remove from old position and insert at index 0
      updatedConversations.splice(conversationIndex, 1);
      updatedConversations.unshift(conversation);
      
      set({ conversations: updatedConversations });
    } else {
      // Optional: If conversation doesn't exist (new chat started), we might refetch or handle it
      get().fetchConversations();
    }
  },

  optimisticSendMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, { ...message, status: 'sending' }]
    }));
  },

  fetchConversations: async () => {
    set({ isLoading: true });
    try {
      const data = await chatService.fetchConversations();
      set({ conversations: data, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      set({ isLoading: false });
    }
  },

  fetchMessages: async (conversationId: string) => {
    set({ isLoading: true });
    try {
      const data = await chatService.fetchMessages(conversationId);
      set({ messages: data, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      set({ isLoading: false });
    }
  },

  startNewChat: async (targetUserId: string) => {
    set({ isLoading: true });
    try {
      const conversation = await chatService.startConversation(targetUserId);
      const { conversations } = get();
      
      // Add to list if it's not already there
      if (!conversations.find(c => c.id === conversation.id)) {
        set({ conversations: [conversation, ...conversations] });
      }
      
      // Activate the chat
      get().setActiveChat(conversation.id);
      set({ isSelectingUser: false, isLoading: false });
    } catch (error) {
      console.error('Failed to start new chat:', error);
      set({ isLoading: false });
    }
  },

  handleMessageError: (conversationId, text) => {
    const { messages } = get();
    set({
      messages: messages.filter(m => 
        !(m.conversationId === conversationId && m.text === text && m.status === 'sending')
      )
    });
  }
}));
