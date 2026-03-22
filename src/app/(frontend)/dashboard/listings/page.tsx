'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@/components/controls/button';
import { useAuth } from '@/features/auth/context';
import { useSellerListings } from '@/features/listings/hooks/use-listings';
import ListingRow from '@/features/listings/components/listing-row';
import {
  DASHBOARD_STATUS_TABS,
  DASHBOARD_TAB_LABELS,
  type DashboardStatusTab,
} from '@/features/listings/constants/status';
import type { ListingWithPhotos, ListingStatus } from '@/features/listings/types/listing';

import styles from './listings-dashboard.module.scss';

function filterByTab(listings: ListingWithPhotos[], tab: DashboardStatusTab): ListingWithPhotos[] {
  if (tab === 'all') return listings.filter((l) => l.status !== 'deleted');
  return listings.filter((l) => l.status === tab);
}

function getTabCount(listings: ListingWithPhotos[], tab: DashboardStatusTab): number {
  return filterByTab(listings, tab).length;
}

export default function ListingsDashboard() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardStatusTab>('all');

  const { data: allListings = [], isLoading } = useSellerListings();

  if (!isAuthenticated) {
    return <p>Please sign in to view your listings.</p>;
  }

  const visibleListings = filterByTab(allListings, activeTab);

  function handleActionsClick(listing: ListingWithPhotos) {
    // Placeholder — will be wired in Phase 4
    router.push(`/dashboard/listings/${listing.id}/edit`);
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.heading}>My Listings</h1>
        <Button style="primary" onClick={() => router.push('/dashboard/listings/new')}>
          Create Listing
        </Button>
      </div>

      <nav className={styles.tabs} aria-label="Listing status filter">
        <div className={styles.tabScroller}>
          {DASHBOARD_STATUS_TABS.map((tab) => {
            const count = getTabCount(allListings, tab);
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(tab)}
                aria-pressed={isActive}
              >
                {DASHBOARD_TAB_LABELS[tab]}
                <span className={styles.tabCount}>{count}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {isLoading ? (
        <p className={styles.loading}>Loading your listings...</p>
      ) : visibleListings.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyText}>
            {activeTab === 'all'
              ? "You don't have any listings yet."
              : `No ${DASHBOARD_TAB_LABELS[activeTab].toLowerCase()} listings.`}
          </p>
          {activeTab === 'all' && (
            <Button style="primary" onClick={() => router.push('/dashboard/listings/new')}>
              Create your first listing
            </Button>
          )}
        </div>
      ) : (
        <div className={styles.list}>
          {visibleListings.map((listing) => (
            <ListingRow
              key={listing.id}
              listing={listing}
              onActionsClick={handleActionsClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
