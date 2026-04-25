import { Server, Socket } from 'socket.io';
import { sendMessageUseCase } from '../../infrastructure/config/di';

/**
 * Registers Chat-specific socket event handlers.
 */
export const registerChatHandlers = (io: Server, socket: Socket) => {
  
  socket.on('SEND_MESSAGE', async (data: { conversationId: string; text: string }) => {
    try {
      const senderId = socket.data.user.id;

      if (!data.conversationId || !data.text) {
        return socket.emit('MESSAGE_ERROR', { reason: 'Conversation ID and text are required' });
      }

      // 1. Execute Send Message Use Case
      // Returns { message: Message, conversation: Conversation }
      const { message, conversation } = await sendMessageUseCase.execute({
        senderId,
        conversationId: data.conversationId,
        text: data.text
      });

      // 2. Delivery Logic (Direct to Participant Rooms)
      // The payload includes the full message object (with senderDetails) and conversationId
      const payload = {
        ...message,
        conversationId: data.conversationId
      };

      conversation.participants.forEach((participantId: string) => {
        // Emit RECEIVE_MESSAGE to each participant's specific room: user:[id]
        io.to(`user:[${participantId}]`).emit('RECEIVE_MESSAGE', payload);
      });

    } catch (error: any) {
      console.error('[ChatHandler] Error in SEND_MESSAGE:', error.message);
      socket.emit('MESSAGE_ERROR', { reason: error.message || 'Failed to send message' });
    }
  });
};
