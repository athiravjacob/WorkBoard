import { Request, Response } from 'express';
import { ListConversations } from '../../application/use-cases/chat/ListConversations';
import { GetOrCreateConversation } from '../../application/use-cases/chat/GetOrCreateConversation';
import { GetMessages } from '../../application/use-cases/chat/GetMessages';
import { SendMessageUseCase } from '../../application/use-cases/chat/SendMessage.usecase';
import { SocketServer } from '../../infrastructure/socket/SocketServer';

export class ChatController {
  constructor(
    private listConversations: ListConversations,
    private getOrCreateConversation: GetOrCreateConversation,
    private getMessagesUseCase: GetMessages,
    private sendMessage: SendMessageUseCase
  ) {}

  async getConversations(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const conversations = await this.listConversations.execute(userId);
      res.json(conversations);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async startConversation(req: Request, res: Response) {
    try {
      const currentUserId = (req as any).user.id;
      const { targetUserId } = req.body;

      if (!targetUserId) {
        return res.status(400).json({ message: 'targetUserId is required' });
      }

      const conversation = await this.getOrCreateConversation.execute({
        currentUserId,
        targetUserId
      });

      res.status(201).json(conversation);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getMessages(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      const messages = await this.getMessagesUseCase.execute(id as string, userId);
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async postMessage(req: Request, res: Response) {
    try {
      const senderId = (req as any).user.id;
      const conversationId = req.params.id as string;
      const { text } = req.body;

      if (!text) {
        return res.status(400).json({ message: 'text is required' });
      }

      const result = await this.sendMessage.execute({
        senderId,
        conversationId,
        text
      });

      // Real-time update via Socket.io
      const io = SocketServer.getInstance().getIO();
      io.to(conversationId.toString()).emit('RECEIVE_MESSAGE', result.message);

      res.status(201).json(result.message);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
