import React, { useEffect } from 'react';
import { ChatSidebar } from './ChatSidebar';
import { MessageFeed } from './MessageFeed';
import { MessageInput } from './MessageInput';
import { useChatStore } from '../store/useChatStore';
import { useChatSync } from '../hooks/useChatSync';

export const ChatLayout: React.FC = () => {
  const fetchConversations = useChatStore((state) => state.fetchConversations);
  
  // Initialize Socket Listener for Chat
  useChatSync();

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return (
    <div className="flex h-full bg-slate-50 overflow-hidden">
      <ChatSidebar />
      <div className="flex-grow flex flex-col min-w-0 bg-white">
        <MessageFeed />
        <MessageInput />
      </div>
    </div>
  );
};
