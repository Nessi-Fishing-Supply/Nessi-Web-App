export type {
  Notification,
  NotificationInsert,
  NotificationType,
  NotificationsResponse,
} from '@/features/notifications/types/notification';

export {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from '@/features/notifications/services/notifications';
