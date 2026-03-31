import type { Metadata } from 'next';
import { Suspense } from 'react';
import ThreadDetailPage from './thread-detail-page';

export const metadata: Metadata = { title: 'Messages' };

interface Props {
  params: Promise<{ thread_id: string }>;
}

export default async function Page({ params }: Props) {
  const { thread_id } = await params;

  return (
    <Suspense>
      <ThreadDetailPage threadId={thread_id} />
    </Suspense>
  );
}
