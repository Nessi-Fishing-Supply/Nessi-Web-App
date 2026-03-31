import { useQuery } from '@tanstack/react-query';
import { getUnreadCount } from '@/features/messaging/services/messaging';

export function useUnreadCount() {
  return useQuery({
    queryKey: ['messages', 'unread-count'],
    queryFn: getUnreadCount,
    refetchInterval: 60_000,
  });
}
