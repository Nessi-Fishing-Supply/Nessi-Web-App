import type { SellerIdentity } from '@/features/listings/types/listing';

export type RecentlyViewedItem = {
  listingId: string;
  viewedAt: string;
};

export type RecentlyViewedListingItem = {
  listingId: string;
  viewedAt: string;
  title: string;
  priceCents: number;
  slug: string;
  status: string;
  coverPhotoUrl: string | null;
  condition: string;
  seller: SellerIdentity | null;
};
