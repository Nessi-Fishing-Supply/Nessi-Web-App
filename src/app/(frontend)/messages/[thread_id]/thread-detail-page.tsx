'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/context';
import { useThread } from '@/features/messaging/hooks/use-thread';
import { useMessages } from '@/features/messaging/hooks/use-messages';
import { useMarkRead } from '@/features/messaging/hooks/use-mark-read';
import PageHeader from '@/components/layout/page-header';
import ErrorState from '@/components/indicators/error-state';
import ComposeBar from '@/features/messaging/components/compose-bar';
import styles from './thread-detail-page.module.scss';

interface ThreadDetailPageProps {
  threadId: string;
}

const SKELETON_ROWS = [
  { side: 'left', size: 'medium' },
  { side: 'right', size: 'short' },
  { side: 'left', size: 'short' },
  { side: 'right', size: 'medium' },
  { side: 'left', size: 'medium' },
  { side: 'right', size: 'short' },
] as const;

export default function ThreadDetailPage({ threadId }: ThreadDetailPageProps) {
  const router = useRouter();
  const { user } = useAuth();

  const {
    data: thread,
    isLoading: isThreadLoading,
    isError: isThreadError,
    refetch: refetchThread,
  } = useThread(threadId);

  const {
    isLoading: isMessagesLoading,
    isError: isMessagesError,
    refetch: refetchMessages,
  } = useMessages(threadId);

  const markRead = useMarkRead();

  useEffect(() => {
    if (threadId) {
      markRead.mutate(threadId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadId]);

  const isLoading = isThreadLoading || isMessagesLoading;
  const isError = isThreadError || isMessagesError;

  const otherParticipant = thread?.participants.find((p) => p.member.id !== user?.id);
  const title = otherParticipant
    ? `${otherParticipant.member.first_name} ${otherParticipant.member.last_name}`
    : 'Messages';

  const handleRetry = () => {
    refetchThread();
    refetchMessages();
  };

  if (isLoading) {
    return (
      <div className={styles.page}>
        <PageHeader title="" onBack={() => router.push('/messages')} />
        <div className={styles.messageArea}>
          <div className={styles.skeleton} role="status" aria-live="polite">
            <span className="sr-only">Loading conversation</span>
            {SKELETON_ROWS.map((row, i) => (
              <div
                key={i}
                className={`${styles.skeletonBubbleRow} ${row.side === 'right' ? styles.skeletonBubbleRowRight : ''}`}
              >
                <div className={styles.skeletonAvatar} />
                <div
                  className={`${styles.skeletonBubble} ${row.size === 'short' ? styles.skeletonBubbleShort : styles.skeletonBubbleMedium}`}
                />
              </div>
            ))}
          </div>
        </div>
        <ComposeBar threadId={threadId} disabled />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.page}>
        <PageHeader title="Messages" onBack={() => router.push('/messages')} />
        <div className={styles.messageArea}>
          <ErrorState
            variant="banner"
            message="Something went wrong loading this conversation"
            action={{ label: 'Retry', onClick: handleRetry }}
          />
        </div>
        <ComposeBar threadId={threadId} disabled />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <PageHeader title={title} onBack={() => router.push('/messages')} />
      <div className={styles.messageArea} />
      <ComposeBar threadId={threadId} />
    </div>
  );
}
