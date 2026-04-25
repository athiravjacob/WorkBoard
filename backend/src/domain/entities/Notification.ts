export enum NotificationType {
  TASK_ASSIGNED = 'TASK_ASSIGNED',
  STATUS_REVIEW = 'STATUS_REVIEW',
  PROJECT_ASSIGNED = 'PROJECT_ASSIGNED',
  STATUS_UPDATED = 'STATUS_UPDATED',
}

export interface NotificationSenderDetails {
  name: string;
  avatar?: string;
}

export class Notification {
  constructor(
    public readonly id: string,
    public readonly recipientId: string,
    public readonly senderId: string,
    public readonly type: NotificationType,
    public readonly relatedId: string,
    public readonly message: string,
    private _isRead: boolean,
    public readonly createdAt: Date,
    public readonly senderDetails?: NotificationSenderDetails
  ) {}

  get isRead(): boolean {
    return this._isRead;
  }

  /**
   * Toggles the isRead status to true.
   */
  public markAsRead(): void {
    this._isRead = true;
  }
}
