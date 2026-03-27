'use client';

import { HiOutlineFlag } from 'react-icons/hi';
import ReportBottomSheet from '@/features/reports/components/report-bottom-sheet';
import { useReportTarget } from '@/features/reports/hooks/use-report-target';
import type { ReportTargetType } from '@/features/reports/types/report';
import styles from './report-trigger.module.scss';

interface ReportTriggerProps {
  currentUserId: string | null;
  isOwnEntity: boolean;
  targetType: ReportTargetType;
  targetId: string;
}

export default function ReportTrigger({
  currentUserId,
  isOwnEntity,
  targetType,
  targetId,
}: ReportTriggerProps) {
  const { openReportSheet, isOpen, close } = useReportTarget({
    target_type: targetType,
    target_id: targetId,
  });

  if (!currentUserId || isOwnEntity) return null;

  return (
    <>
      <button type="button" className={styles.triggerButton} onClick={openReportSheet}>
        <HiOutlineFlag aria-hidden="true" />
        Report this {targetType}
      </button>

      <ReportBottomSheet
        isOpen={isOpen}
        onClose={close}
        targetType={targetType}
        targetId={targetId}
      />
    </>
  );
}
