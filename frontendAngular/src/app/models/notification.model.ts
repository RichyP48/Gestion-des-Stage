export interface Notification {
  id: number;
  userId: number;
  type: NotificationType;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export enum NotificationType {
  APPLICATION_UPDATE = 'APPLICATION_UPDATE',
  MESSAGE_RECEIVED = 'MESSAGE_RECEIVED',
  AGREEMENT_UPDATE = 'AGREEMENT_UPDATE',
  SYSTEM = 'SYSTEM'
}

export interface NotificationResponse {
  content: Notification[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface UnreadCountResponse {
  unreadCount: number;
}