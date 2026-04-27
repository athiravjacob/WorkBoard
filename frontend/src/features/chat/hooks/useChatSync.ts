import { useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { socketService } from '../../../lib/socketService';
import type { Message } from '../services/chatService';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';

/**
 * useChatSync Hook
 * Bridges Socket.io events with the Zustand store.
 * Handles real-time message sync, echo prevention, and cross-chat notifications.
 */
export const useChatSync = () => {
  const { activeChatId, receiveNewMessage, handleMessageError } = useChatStore();
  const currentUser = useAuthStore((state) => state.user);
  const { pathname } = useLocation();
  const isAuthPage = ['/login', '/register'].includes(pathname);

  // 1. Stable Connection & Global Listeners
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || isAuthPage) return;

    console.log('[ChatSync] Initializing socket connection...');
    socketService.connect(token);

    const handleReceiveMessage = (message: Message) => {
      console.log('[ChatSync] RECEIVE_MESSAGE:', message);
      receiveNewMessage(message);

      // Cross-Chat Notifications
      const isFromMe = String(message.senderId) === String(currentUser?.id);
      if (!isFromMe && message.conversationId !== activeChatId) {
        toast.info(message.senderDetails?.name || 'New Message', {
          description: message.text,
          action: {
            label: 'Open Chat',
            onClick: () => {}
          }
        });
      }
    };

    socketService.on('RECEIVE_MESSAGE', handleReceiveMessage);

    socketService.on('MESSAGE_ERROR', (error: { reason: string; conversationId: string; text: string }) => {
      console.error('[ChatSync] MESSAGE_ERROR:', error);
      toast.error('Failed to send message', {
        description: error.reason
      });
      if (error.conversationId && error.text) {
        handleMessageError(error.conversationId, error.text);
      }
    });

    return () => {
      console.log('[ChatSync] Cleaning up listeners...');
      socketService.off('RECEIVE_MESSAGE');
      socketService.off('MESSAGE_ERROR');
    };
  }, [activeChatId, receiveNewMessage, handleMessageError, currentUser?.id, isAuthPage]); // activeChatId added back for correct closure in notifications

  // 2. Room Component Lifecycle (Join/Leave)
  useEffect(() => {
    if (activeChatId) {
      console.log(`[ChatSync] Joining room: ${activeChatId}`);
      socketService.emit('JOIN_CONVERSATION', activeChatId);
    }
  }, [activeChatId]);
};
