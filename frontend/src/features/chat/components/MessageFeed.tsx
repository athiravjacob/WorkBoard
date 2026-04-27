import React, { useEffect, useRef } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { format } from 'date-fns';

export const MessageFeed: React.FC = () => {
  const { messages, activeChatId } = useChatStore();
  const currentUser = useAuthStore((state) => state.user);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!activeChatId) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center bg-slate-50/30 text-slate-400 space-y-4">
        <div className="w-16 h-16 bg-white rounded-3xl shadow-sm flex items-center justify-center">
          <svg className="w-8 h-8 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.855-1.246L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <p className="text-sm font-medium">Select a conversation to start chatting</p>
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar bg-white">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="px-4 py-2 bg-slate-50 rounded-full text-[10px] uppercase font-black text-slate-400 tracking-widest mb-4">
            Start of your conversation
          </div>
        </div>
      ) : (
        messages.map((msg, idx) => {
          const isMine = String(msg.senderId) === String(currentUser?.id);
          const showSenderInfo = !isMine && (idx === 0 || messages[idx-1].senderId !== msg.senderId);

          return (
            <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex flex-col max-w-[70%] ${isMine ? 'items-end' : 'items-start'}`}>
                {showSenderInfo && (
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {msg.senderDetails?.name || 'User'}
                    </span>
                  </div>
                )}
                
                <div className="group relative">
                  <div
                    className={`px-4 py-2.5 rounded-2xl shadow-sm text-sm leading-relaxed ${
                      isMine
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-slate-100 text-slate-800 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  
                  {/* Timestamp & Status */}
                  <div className={`mt-1 flex items-center gap-1.5 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                      {format(new Date(msg.createdAt), 'HH:mm')}
                    </span>
                    {isMine && msg.status === 'sending' && (
                       <div className="w-2.5 h-2.5 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
