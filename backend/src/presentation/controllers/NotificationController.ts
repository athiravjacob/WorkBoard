import { Request, Response } from 'express';
import { GetNotificationsUseCase } from '../../application/use-cases/notification/GetNotifications';
import { MarkAsReadUseCase } from '../../application/use-cases/notification/MarkAsRead';
import { MarkAllAsReadUseCase } from '../../application/use-cases/notification/MarkAllAsRead';
import { GetUnreadCountUseCase } from '../../application/use-cases/notification/GetUnreadCount';

import { NotificationMapper } from '../../infrastructure/mappers/NotificationMapper';

export class NotificationController {
  constructor(
    private getNotificationsUseCase: GetNotificationsUseCase,
    private markAsReadUseCase: MarkAsReadUseCase,
    private markAllAsReadUseCase: MarkAllAsReadUseCase,
    private getUnreadCountUseCase: GetUnreadCountUseCase
  ) {}


  public getNotifications = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const limit = parseInt(req.query.limit as string) || 20;
      const skip = parseInt(req.query.skip as string) || 0;

      const notifications = await this.getNotificationsUseCase.execute(userId, limit, skip);
      
      const dtos = notifications.map(notif => NotificationMapper.toDTO(notif));

      res.status(200).json(dtos);
    } catch (error: any) {
      console.error('Get notifications error:', error);
      res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  };

  public getUnreadCount = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const count = await this.getUnreadCountUseCase.execute(userId);
      res.status(200).json({ count });
    } catch (error: any) {
      console.error('Get unread count error:', error);
      res.status(500).json({ error: 'Failed to fetch unread count' });
    }
  };

  public markAsRead = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;

      await this.markAsReadUseCase.execute(id as string, userId);
      res.status(200).json({ message: 'Notification marked as read' });
    } catch (error: any) {
      console.error('Mark as read error:', error);
      const status = error.message === 'Notification not found' ? 404 : 500;
      res.status(status).json({ error: error.message || 'Failed to mark notification as read' });
    }
  };

  public markAllAsRead = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      await this.markAllAsReadUseCase.execute(userId);
      res.status(200).json({ message: 'All notifications marked as read' });
    } catch (error: any) {
      console.error('Mark all as read error:', error);
      res.status(500).json({ error: 'Failed to mark all notifications as read' });
    }
  };
}

