import { ISocketService } from '../../application/services/ISocketService';
import { SocketServer } from '../socket/SocketServer';

export class SocketService implements ISocketService {
  public sendNotification(recipientId: string, notification: any): void {
    try {
      const io = SocketServer.getInstance().getIO();
      const roomName = `user:${recipientId}`;
      
      console.log(`Sending real-time notification to ${roomName}:`, notification);
      io.to(roomName).emit('NEW_NOTIFICATION', notification);
    } catch (error) {
      console.error('Failed to send real-time notification:', error);
    }
  }
}
