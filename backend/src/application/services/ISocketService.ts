export interface ISocketService {
  sendNotification(recipientId: string, notification: any): void;
}
