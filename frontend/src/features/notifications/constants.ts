export const NOTIFICATION_EVENTS = {
  NEW_NOTIFICATION: 'NEW_NOTIFICATION',
} as const;

export const NOTIFICATION_TYPES = {
  TASK_ASSIGNED: 'TASK_ASSIGNED',
  STATUS_REVIEW: 'STATUS_REVIEW',
  PROJECT_ASSIGNED: 'PROJECT_ASSIGNED',
  STATUS_UPDATED: 'STATUS_UPDATED',
} as const;

export const NOTIFICATION_API_ROUTES = {
  BASE: '/notifications',
  UNREAD_COUNT: '/notifications/unread-count',
  MARK_ALL_READ: '/notifications/read-all',
  MARK_READ: (id: string) => `/notifications/${id}/read`,
} as const;
