import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';

export class SocketServer {
  private static instance: SocketServer;
  private io: SocketIOServer | null = null;
  private readonly accessSecret: string;

  private constructor() {
    this.accessSecret = process.env.JWT_ACCESS_SECRET || 'default_access_secret';
  }

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

    // Authentication Middleware
    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication error: Token missing'));
      }

      jwt.verify(token, this.accessSecret, (err: any, decoded: any) => {
        if (err) {
          return next(new Error('Authentication error: Invalid token'));
        }
        
        socket.data.user = {
          id: decoded.userId,
          role: decoded.role
        };
        next();
      });
    });

    this.io.on('connection', (socket) => {
      const userId = socket.data.user.id;
      console.log(`User connected: ${userId} (Socket: ${socket.id})`);

      // Automatically join personal room
      const roomName = `user:${userId}`;
      socket.join(roomName);
      console.log(`Socket ${socket.id} joined room: ${roomName}`);

      socket.on('disconnect', () => {
        console.log(`User disconnected: ${userId} (Socket: ${socket.id})`);
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
