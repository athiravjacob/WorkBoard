import { Router } from 'express';
import { chatController } from '../../infrastructure/config/di';
import { authMiddleware } from '../middlewares/AuthMiddleware';

const chatRoutes = Router();

// All chat routes require authentication
chatRoutes.use(authMiddleware);

chatRoutes.get('/conversations', (req, res) => chatController.getConversations(req, res));
chatRoutes.post('/conversations', (req, res) => chatController.startConversation(req, res));
chatRoutes.get('/conversations/:id/messages', (req, res) => chatController.getMessages(req, res));
chatRoutes.post('/conversations/:id/messages', (req, res) => chatController.postMessage(req, res));

export { chatRoutes };
