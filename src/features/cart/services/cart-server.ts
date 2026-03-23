import { createClient } from '@/libs/supabase/server';
import type {
  CartItem,
  CartItemWithListing,
  CartValidationResult,
  GuestCartItem,
} from '@/features/cart/types/cart';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_CART_SIZE = 25;
const EXPIRY_DAYS = 30;

// ---------- Read operations ----------

export async function getCartServer(userId: string): Promise<CartItemWithListing[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('cart_items')
    .select(
      '*, listing:listings(title, price_cents, cover_photo_url, status, seller_id, member_id, shop_id, listing_photos(*))',
    )
    .eq('user_id', userId)
    .order('added_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch cart: ${error.message}`);
  }

  return (data ?? []) as CartItemWithListing[];
}

export async function getCartCountServer(userId: string): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from('cart_items')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (error) {
    throw new Error(`Failed to fetch cart count: ${error.message}`);
  }

  return count ?? 0;
}

// ---------- Write operations ----------

export async function addToCartServer(
  userId: string,
  listingId: string,
  _priceCents: number,
  addedFrom?: string,
): Promise<CartItem> {
  const supabase = await createClient();

  // 1. Fetch listing — must exist and be active
  const { data: listing, error: listingError } = await supabase
    .from('listings')
    .select('id, price_cents, status, seller_id')
    .eq('id', listingId)
    .is('deleted_at', null)
    .single();

  if (listingError || !listing) {
    throw new Error('Listing not found or no longer active');
  }

  if (listing.status !== 'active') {
    throw new Error('Listing not found or no longer active');
  }

  // 2. Cannot add own listing
  if (listing.seller_id === userId) {
    throw new Error('Cannot add your own listing to cart');
  }

  // 3. Check for duplicate (better error than DB unique constraint)
  const { data: existing } = await supabase
    .from('cart_items')
    .select('id')
    .eq('user_id', userId)
    .eq('listing_id', listingId)
    .maybeSingle();

  if (existing) {
    throw new Error('Item already in cart');
  }

  // 4. Cart size cap
  const currentCount = await getCartCountServer(userId);
  if (currentCount >= MAX_CART_SIZE) {
    throw new Error('Cart is full (maximum 25 items)');
  }

  // 5. Insert with price snapshotted from DB (ignore client-provided price)
  const { data: inserted, error: insertError } = await supabase
    .from('cart_items')
    .insert({
      user_id: userId,
      listing_id: listingId,
      price_at_add: listing.price_cents,
      added_from: addedFrom ?? null,
    })
    .select()
    .single();

  if (insertError || !inserted) {
    throw new Error(`Failed to add item to cart: ${insertError?.message}`);
  }

  return inserted as CartItem;
}

export async function removeFromCartServer(userId: string, cartItemId: string): Promise<void> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', cartItemId)
    .eq('user_id', userId)
    .select('id')
    .single();

  if (error || !data) {
    throw new Error('Cart item not found');
  }
}

export async function clearCartServer(userId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('cart_items').delete().eq('user_id', userId);

  if (error) {
    throw new Error(`Failed to clear cart: ${error.message}`);
  }
}

export async function refreshExpiryServer(userId: string, cartItemId: string): Promise<CartItem> {
  const supabase = await createClient();
  const newExpiry = new Date(Date.now() + EXPIRY_DAYS * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from('cart_items')
    .update({ expires_at: newExpiry })
    .eq('id', cartItemId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error || !data) {
    throw new Error('Cart item not found');
  }

  return data as CartItem;
}

// ---------- Validation & merge ----------

export async function validateCartServer(userId: string): Promise<CartValidationResult> {
  const items = await getCartServer(userId);

  const result: CartValidationResult = {
    valid: [],
    removed: [],
    priceChanged: [],
  };

  for (const item of items) {
    const { listing } = item;

    if (!listing) {
      result.removed.push({ item, reason: 'deleted' });
      continue;
    }

    if (listing.status === 'sold') {
      result.removed.push({ item, reason: 'sold' });
      continue;
    }

    if (listing.status !== 'active') {
      result.removed.push({ item, reason: 'deactivated' });
      continue;
    }

    if (item.price_at_add !== listing.price_cents) {
      result.priceChanged.push({
        item,
        oldPrice: item.price_at_add,
        newPrice: listing.price_cents,
      });
      continue;
    }

    result.valid.push(item);
  }

  return result;
}

export async function mergeGuestCartServer(
  userId: string,
  guestItems: GuestCartItem[],
): Promise<number> {
  const supabase = await createClient();
  let mergedCount = 0;

  // Get current cart count to enforce cap across the merge
  let currentCount = await getCartCountServer(userId);

  for (const guestItem of guestItems) {
    // Validate UUID format
    if (!UUID_REGEX.test(guestItem.listingId)) {
      continue;
    }

    // Enforce cart cap
    if (currentCount >= MAX_CART_SIZE) {
      break;
    }

    // Fetch listing from DB — ignore guest-provided price
    const { data: listing } = await supabase
      .from('listings')
      .select('id, price_cents, status, seller_id')
      .eq('id', guestItem.listingId)
      .is('deleted_at', null)
      .single();

    if (!listing || listing.status !== 'active') {
      continue;
    }

    // Skip own listings
    if (listing.seller_id === userId) {
      continue;
    }

    // Skip duplicates
    const { data: existing } = await supabase
      .from('cart_items')
      .select('id')
      .eq('user_id', userId)
      .eq('listing_id', guestItem.listingId)
      .maybeSingle();

    if (existing) {
      continue;
    }

    // Insert with DB-snapshotted price
    const { error: insertError } = await supabase.from('cart_items').insert({
      user_id: userId,
      listing_id: guestItem.listingId,
      price_at_add: listing.price_cents,
      added_from: guestItem.addedFrom ?? null,
    });

    if (!insertError) {
      mergedCount++;
      currentCount++;
    }
  }

  return mergedCount;
}
