import { useEffect, useRef, useState } from 'react';

import useCreateWizardStore from '@/features/listings/stores/create-wizard-store';
import { useUpdateListing } from '@/features/listings/hooks/use-listings';

interface AutoSaveDraftResult {
  lastSavedAt: Date | null;
  isSaving: boolean;
}

interface WizardSnapshot {
  category: string | null;
  condition: string | null;
  title: string;
  description: string;
  fishingHistory: string;
  priceCents: number;
  shippingPreference: 'ship' | 'local_pickup';
  shippingPaidBy: 'buyer' | 'seller' | null;
  weightOz: number;
  packageDimensions: { length: number; width: number; height: number } | null;
}

function isDirty(a: WizardSnapshot, b: WizardSnapshot): boolean {
  return JSON.stringify(a) !== JSON.stringify(b);
}

const DEBOUNCE_MS = 30_000;

export function useAutoSaveDraft(): AutoSaveDraftResult {
  const listingId = useCreateWizardStore.use.listingId();
  const category = useCreateWizardStore.use.category();
  const condition = useCreateWizardStore.use.condition();
  const title = useCreateWizardStore.use.title();
  const description = useCreateWizardStore.use.description();
  const fishingHistory = useCreateWizardStore.use.fishingHistory();
  const priceCents = useCreateWizardStore.use.priceCents();
  const shippingPreference = useCreateWizardStore.use.shippingPreference();
  const shippingPaidBy = useCreateWizardStore.use.shippingPaidBy();
  const weightOz = useCreateWizardStore.use.weightOz();
  const packageDimensions = useCreateWizardStore.use.packageDimensions();

  const { mutateAsync: updateListing } = useUpdateListing();

  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const lastSavedSnapshotRef = useRef<WizardSnapshot | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentSnapshot: WizardSnapshot = {
    category,
    condition,
    title,
    description,
    fishingHistory,
    priceCents,
    shippingPreference,
    shippingPaidBy,
    weightOz,
    packageDimensions,
  };

  useEffect(() => {
    if (!listingId) return;
    if (lastSavedSnapshotRef.current !== null && !isDirty(currentSnapshot, lastSavedSnapshotRef.current)) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(async () => {
      const snapshot = { ...currentSnapshot };

      if (lastSavedSnapshotRef.current !== null && !isDirty(snapshot, lastSavedSnapshotRef.current)) return;

      setIsSaving(true);
      try {
        await updateListing({
          id: listingId,
          data: {
            category: snapshot.category,
            condition: snapshot.condition,
            title: snapshot.title,
            description: snapshot.description,
            fishing_history: snapshot.fishingHistory,
            price_cents: snapshot.priceCents,
            shipping_preference: snapshot.shippingPreference,
            shipping_paid_by: snapshot.shippingPaidBy,
            weight_oz: snapshot.weightOz,
            package_dimensions: snapshot.packageDimensions,
          },
        });
        lastSavedSnapshotRef.current = snapshot;
        setLastSavedAt(new Date());
      } finally {
        setIsSaving(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    listingId,
    category,
    condition,
    title,
    description,
    fishingHistory,
    priceCents,
    shippingPreference,
    shippingPaidBy,
    weightOz,
    packageDimensions,
  ]);

  return { lastSavedAt, isSaving };
}
