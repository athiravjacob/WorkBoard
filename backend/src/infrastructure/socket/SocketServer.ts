import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { socketMiddleware } from './socketMiddleware';
import { registerChatHandlers } from '../../presentation/socket/chatHandler';

export class SocketServer {
  private static instance: SocketServer;
  private io: SocketIOServer | null = null;

  private constructor() {}

  public static getInstance(): SocketServer {
    if (!SocketServer.instance) {
      SocketServer.instance = new SocketServer();
    }
    return SocketServer.instance;
  }

  public init(server: HTTPServer): SocketIOServer {
    if (this.io) {
      return this.io;
    }

    this.io = new SocketIOServer(server, {
      cors: {
        origin: 'http://localhost:5173', // Shared with app.ts
        methods: ['GET', 'POST'],
        credentials: true
      }
    });

    // Use centralized Secure Socket Middleware
    this.io.use(socketMiddleware);

    // Connection Logic
    this.io.on('connection', (socket) => {
      const userId = socket.data.user.id;
      console.log(`[Socket] User Arrived: ${userId} (SocketID: ${socket.id})`);

      // Register Handlers
      registerChatHandlers(this.io!, socket);

      // Automatically join private room: user:[userId]
      const roomName = `user:[${userId}]`;
      socket.join(roomName);
      console.log(`[Socket] User ${userId} joined private room: ${roomName}`);

      socket.on('disconnect', () => {
        console.log(`[Socket] User Left: ${userId} (SocketID: ${socket.id})`);
      });
    });

    return this.io;
  }

  public getIO(): SocketIOServer {
    if (!this.io) {
      throw new Error('Socket.io not initialized. Call init(server) first.');
    }
    return this.io;
  }
}
