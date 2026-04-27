import React, { useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { socketService } from '../../../lib/socketService';

export const MessageInput: React.FC = () => {
  const [text, setText] = useState('');
  const { activeChatId, optimisticSendMessage } = useChatStore();
  const currentUser = useAuthStore((state) => state.user);

  const handleSend = () => {
    if (!text.trim() || !activeChatId || !currentUser) return;

    const messageData = {
      conversationId: activeChatId,
      text: text.trim()
    };

    // Optimistic UI Update
    optimisticSendMessage({
      id: `temp-${Date.now()}`,
      conversationId: activeChatId,
      senderId: currentUser.id,
      text: text.trim(),
      isRead: false,
      createdAt: new Date().toISOString(),
      senderDetails: {
        name: currentUser.name,
        avatar: currentUser.avatar
      }
    });

    // Emit Socket Event
    socketService.emit('SEND_MESSAGE', messageData);
    
    setText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 bg-white border-t border-slate-100">
      <div className="flex items-end gap-3 max-w-5xl mx-auto">
        <div className="flex-grow relative">
          <textarea
            disabled={!activeChatId}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={activeChatId ? "Type a message..." : "Select a chat to message"}
            rows={1}
            className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none disabled:opacity-50 min-h-[44px] max-h-32 custom-scrollbar"
          />
        </div>
        
        <button
          disabled={!text.trim() || !activeChatId}
          onClick={handleSend}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:cursor-not-allowed text-white p-3 rounded-2xl transition-all shadow-sm active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
};
