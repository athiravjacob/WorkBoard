import { Server, Socket } from 'socket.io';
import { sendMessageUseCase } from '../../infrastructure/config/di';

/**
 * Registers Chat-specific socket event handlers.
 */
export const registerChatHandlers = (io: Server, socket: Socket) => {
  
  socket.on('JOIN_CONVERSATION', (conversationId: string) => {
    try {
      if (!conversationId) return;
      const room = conversationId.toString();
      socket.join(room);
      console.log(`[ChatSync] User ${socket.data.user.id} joined room ${room}`);
    } catch (error: any) {
      if (error.name === 'BSONError' || error.name === 'CastError') {
        console.error('[ChatSync] ID Format Mismatch in JOIN_CONVERSATION:', error.message);
      }
      console.error('[ChatSync] Error joining room:', error.message);
    }
  });

  socket.on('SEND_MESSAGE', async (data: { conversationId: string; text: string }) => {
    try {
      const senderId = socket.data.user.id;

      if (!data.conversationId || !data.text) {
        return socket.emit('MESSAGE_ERROR', { 
          reason: 'Conversation ID and text are required',
          conversationId: data.conversationId,
          text: data.text
        });
      }

      const { message } = await sendMessageUseCase.execute({
        senderId,
        conversationId: data.conversationId,
        text: data.text
      });

      // Emit to the conversation-specific room
      const room = data.conversationId.toString();
      io.to(room).emit('RECEIVE_MESSAGE', message);

    } catch (error: any) {
      if (error.name === 'BSONError' || error.name === 'CastError') {
        console.error('[ChatSync] ID Format Mismatch in SEND_MESSAGE:', error.message);
      }
      console.error('[ChatHandler] Error in SEND_MESSAGE:', error.message);
      socket.emit('MESSAGE_ERROR', { 
        reason: error.message || 'Failed to send message',
        conversationId: data.conversationId,
        text: data.text
      });
    }
  });
};
