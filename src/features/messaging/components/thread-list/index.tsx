'use client';

import type { ThreadWithParticipants } from '@/features/messaging/types/thread';
import ThreadRow from './thread-row';

interface ThreadListProps {
  threads: ThreadWithParticipants[];
  currentUserId: string;
}

export default function ThreadList({ threads, currentUserId }: ThreadListProps) {
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {threads.map((thread) => (
        <li key={thread.id}>
          <ThreadRow thread={thread} currentUserId={currentUserId} />
        </li>
      ))}
    </ul>
  );
}
