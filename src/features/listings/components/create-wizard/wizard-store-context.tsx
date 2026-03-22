'use client';

import { createContext, useContext } from 'react';
import useCreateWizardStore from '@/features/listings/stores/create-wizard-store';

/**
 * Shared interface for both create and edit wizard stores.
 * Only includes the selectors that step components actually use.
 */
interface WizardStoreApi {
  use: {
    step: () => number;
    photoCount: () => number;
    category: () => string | null;
    condition: () => string | null;
    title: () => string;
    description: () => string;
    priceCents: () => number;
    shippingPreference: () => 'ship' | 'local_pickup';
    shippingPaidBy: () => 'buyer' | 'seller' | null;
    weightOz: () => number;
    draftId: () => string | null;
    setStep: () => (step: number) => void;
    setField: () => <K extends string>(key: K, value: unknown) => void;
    reset: () => () => void;
  };
}

const WizardStoreContext = createContext<WizardStoreApi>(
  useCreateWizardStore as unknown as WizardStoreApi,
);

export function WizardStoreProvider({
  store,
  children,
}: {
  store: WizardStoreApi;
  children: React.ReactNode;
}) {
  return <WizardStoreContext.Provider value={store}>{children}</WizardStoreContext.Provider>;
}

export function useWizardStore(): WizardStoreApi {
  return useContext(WizardStoreContext);
}
