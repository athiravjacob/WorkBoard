import { eventBus, WORKBOARD_EVENTS } from '../../infrastructure/events/eventBus';
import { CreateNotificationUseCase } from '../use-cases/notification/CreateNotification';
import { NotificationType } from '../../domain/entities/Notification';
import { TaskStatus } from '../../domain/entities/Task';
import { ISocketService } from '../services/ISocketService';

export class NotificationSubscriber {
  constructor(
    private createNotification: CreateNotificationUseCase,
    private socketService: ISocketService
  ) {
    this.setupListeners();
  }

  private setupListeners(): void {
    // 1. Project Assigned
    eventBus.on(WORKBOARD_EVENTS.PROJECT_ASSIGNED, async (data: { 
      projectId: string; 
      projectName: string; 
      pmId: string; 
      adminId: string; 
    }) => {
      try {
        const notification = await this.createNotification.execute({
          recipientId: data.pmId,
          senderId: data.adminId,
          type: NotificationType.PROJECT_ASSIGNED,
          relatedId: data.projectId,
          message: `Admin assigned you to project: ${data.projectName}`,
        });

        if (notification) {
          this.socketService.sendNotification(data.pmId, notification);
        }
      } catch (error) {
        console.error('Error handling PROJECT_ASSIGNED event:', error);
      }
    });

    // 2. Task Assigned
    eventBus.on(WORKBOARD_EVENTS.TASK_ASSIGNED, async (data: { 
      taskId: string; 
      taskTitle: string; 
      assignedToId: string; 
      pmId: string; 
    }) => {
      try {
        const notification = await this.createNotification.execute({
          recipientId: data.assignedToId,
          senderId: data.pmId,
          type: NotificationType.TASK_ASSIGNED,
          relatedId: data.taskId,
          message: `You have been assigned to task: ${data.taskTitle}`,
        });

        if (notification) {
          this.socketService.sendNotification(data.assignedToId, notification);
        }
      } catch (error) {
        console.error('Error handling TASK_ASSIGNED event:', error);
      }
    });

    // 3. Task Status Changed
    eventBus.on(WORKBOARD_EVENTS.TASK_STATUS_CHANGED, async (data: { 
      taskId: string; 
      taskTitle: string; 
      newStatus: TaskStatus; 
      pmId: string; 
      assignedToId: string; 
      actorId: string;
      actorName: string;
      redoNote?: string;
    }) => {
      try {
        let notification;

        if (data.newStatus === TaskStatus.REVIEW) {
          // Notify PM
          notification = await this.createNotification.execute({
            recipientId: data.pmId,
            senderId: data.actorId,
            type: NotificationType.STATUS_REVIEW,
            relatedId: data.taskId,
            message: `${data.actorName} submitted ${data.taskTitle} for review`,
          });

          if (notification) {
            this.socketService.sendNotification(data.pmId, notification);
          }
        } else if (data.newStatus === TaskStatus.REDO) {
          // Notify Assigned User
          notification = await this.createNotification.execute({
            recipientId: data.assignedToId,
            senderId: data.pmId,
            type: NotificationType.STATUS_UPDATED,
            relatedId: data.taskId,
            message: `Changes requested on ${data.taskTitle}: ${data.redoNote || 'Please check comments.'}`,
          });

          if (notification) {
            this.socketService.sendNotification(data.assignedToId, notification);
          }
        } else if (data.newStatus === TaskStatus.COMPLETED) {
          // Notify Assigned User
          notification = await this.createNotification.execute({
            recipientId: data.assignedToId,
            senderId: data.pmId,
            type: NotificationType.STATUS_UPDATED,
            relatedId: data.taskId,
            message: `Task ${data.taskTitle} has been approved`,
          });

          if (notification) {
            this.socketService.sendNotification(data.assignedToId, notification);
          }
        }
      } catch (error) {
        console.error('Error handling TASK_STATUS_CHANGED event:', error);
      }
    });
  }
}
