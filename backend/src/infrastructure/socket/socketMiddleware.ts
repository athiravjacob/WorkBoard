import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

const accessSecret = process.env.JWT_ACCESS_SECRET || 'default_access_secret';

export const socketMiddleware = (socket: Socket, next: (err?: Error) => void) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    console.error('Socket authentication failed: Token missing');
    return next(new Error('Authentication error: Token missing'));
  }

  jwt.verify(token, accessSecret, (err: any, decoded: any) => {
    if (err) {
      console.error('Socket authentication failed: Invalid token');
      return next(new Error('Authentication error: Invalid token'));
    }

    // Attach user data to socket
    socket.data.user = {
      id: decoded.userId,
      role: decoded.role
    };
    
    next();
  });
};
