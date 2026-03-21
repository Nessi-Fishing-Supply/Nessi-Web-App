-- ============================================================
-- Migration: listings_schema
-- Created: 2026-03-21
-- Renames products → listings and product_images → listing_photos.
-- Introduces four domain enums: listing_category, listing_condition,
-- listing_status, and shipping_paid_by.
-- Subsequent tasks in this migration append columns, constraints,
-- indexes, and RLS policies to the renamed tables.
-- ============================================================

-- ============================================================
-- Step 1: Create enums (idempotent via DO blocks)
-- ============================================================

DO $$ BEGIN
  CREATE TYPE listing_category AS ENUM (
    'rods',
    'reels',
    'lures',
    'flies',
    'tackle',
    'line',
    'apparel',
    'electronics',
    'watercraft',
    'other'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE listing_condition AS ENUM (
    'new_with_tags',
    'new_without_tags',
    'like_new',
    'good',
    'fair',
    'poor'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE listing_status AS ENUM (
    'draft',
    'active',
    'reserved',
    'sold',
    'archived',
    'deleted'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE shipping_paid_by AS ENUM (
    'seller',
    'buyer',
    'split'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================
-- Step 2: Drop existing RLS policies before renaming tables
-- ============================================================

-- products
DROP POLICY IF EXISTS "Products are viewable by everyone"  ON public.products;
DROP POLICY IF EXISTS "Users can insert own products"      ON public.products;
DROP POLICY IF EXISTS "Users can update own products"      ON public.products;
DROP POLICY IF EXISTS "Users can delete own products"      ON public.products;

-- product_images
DROP POLICY IF EXISTS "Product images are viewable by everyone"      ON public.product_images;
DROP POLICY IF EXISTS "Users can insert images for own products"     ON public.product_images;
DROP POLICY IF EXISTS "Users can update images for own products"     ON public.product_images;
DROP POLICY IF EXISTS "Users can delete images for own products"     ON public.product_images;

-- ============================================================
-- Step 3: Rename tables
-- ============================================================

ALTER TABLE public.products       RENAME TO listings;
ALTER TABLE public.product_images RENAME TO listing_photos;

-- ============================================================
-- Step 4: Add new columns to listings
-- ============================================================

ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS category listing_category;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS condition listing_condition;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS price_cents INTEGER;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS status listing_status NOT NULL DEFAULT 'draft';
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS seller_id UUID;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS cover_photo_url TEXT;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS brand TEXT;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS model TEXT;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS quantity INTEGER NOT NULL DEFAULT 1;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS shipping_paid_by shipping_paid_by;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS shipping_price_cents INTEGER;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS weight_oz NUMERIC;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS location_state TEXT;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS location_city TEXT;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS view_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS favorite_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS inquiry_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector(
      'english',
      coalesce(title, '') || ' ' ||
      coalesce(description, '') || ' ' ||
      coalesce(brand, '') || ' ' ||
      coalesce(model, '')
    )
  ) STORED;

-- ============================================================
-- Step 5: Migrate existing data
-- ============================================================

UPDATE public.listings SET
  price_cents = ROUND(price * 100)::INTEGER,
  seller_id = member_id,
  status = 'active',
  category = 'other',
  condition = 'good',
  published_at = created_at
WHERE price_cents IS NULL;

-- ============================================================
-- Step 6: Apply NOT NULL constraints after data migration
-- ============================================================

ALTER TABLE public.listings ALTER COLUMN price_cents SET NOT NULL;
ALTER TABLE public.listings ALTER COLUMN category SET NOT NULL;
ALTER TABLE public.listings ALTER COLUMN condition SET NOT NULL;
ALTER TABLE public.listings ALTER COLUMN seller_id SET NOT NULL;

-- ============================================================
-- Step 7: Add FK constraint for seller_id
-- ============================================================

ALTER TABLE public.listings
  ADD CONSTRAINT listings_seller_id_fkey
  FOREIGN KEY (seller_id) REFERENCES public.members(id) ON DELETE RESTRICT;

-- ============================================================
-- Step 8: Drop old columns and constraints
-- ============================================================

-- Drop the legacy price column (replaced by price_cents)
ALTER TABLE public.listings DROP COLUMN IF EXISTS price;

-- Drop the single-owner check constraint (renamed from products table)
ALTER TABLE public.listings DROP CONSTRAINT IF EXISTS products_single_owner_check;

-- NOTE: member_id and shop_id are intentionally retained for backward
-- compatibility with the dual-owner model. seller_id is the new canonical
-- owner column. These will be removed in a future migration once the
-- ownership model is fully migrated.

-- ============================================================
-- Step 9: listing_photos changes
-- ============================================================

ALTER TABLE public.listing_photos RENAME COLUMN product_id TO listing_id;
ALTER TABLE public.listing_photos ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE public.listing_photos ADD COLUMN IF NOT EXISTS position INTEGER NOT NULL DEFAULT 0;

-- Re-create the FK constraint with the new name (the old constraint was
-- automatically renamed when product_images was renamed to listing_photos)
ALTER TABLE public.listing_photos DROP CONSTRAINT IF EXISTS product_images_product_id_fkey;
ALTER TABLE public.listing_photos
  ADD CONSTRAINT listing_photos_listing_id_fkey
  FOREIGN KEY (listing_id) REFERENCES public.listings(id) ON DELETE CASCADE;

-- ============================================================
-- Step 10: Enable pg_trgm extension
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================================
-- Step 11: Create indexes
-- ============================================================

-- Full-text search
CREATE INDEX IF NOT EXISTS listings_search_vector_idx ON public.listings USING gin (search_vector);

-- Trigram index on title for typo-tolerant search
CREATE INDEX IF NOT EXISTS listings_title_trgm_idx ON public.listings USING gin (title gin_trgm_ops);

-- Lookup indexes
CREATE INDEX IF NOT EXISTS listings_seller_id_idx ON public.listings (seller_id);
CREATE INDEX IF NOT EXISTS listings_shop_id_idx ON public.listings (shop_id);
CREATE INDEX IF NOT EXISTS listings_member_id_idx ON public.listings (member_id);
CREATE INDEX IF NOT EXISTS listings_status_idx ON public.listings (status);
CREATE INDEX IF NOT EXISTS listings_category_idx ON public.listings (category);
CREATE INDEX IF NOT EXISTS listings_condition_idx ON public.listings (condition);
CREATE INDEX IF NOT EXISTS listings_created_at_idx ON public.listings (created_at);
CREATE INDEX IF NOT EXISTS listings_price_cents_idx ON public.listings (price_cents);

-- Composite index for feed queries (active listings sorted by recency)
CREATE INDEX IF NOT EXISTS listings_active_feed_idx ON public.listings (status, published_at DESC);

-- Partial index for active-only queries (most common)
CREATE INDEX IF NOT EXISTS listings_active_partial_idx ON public.listings (published_at DESC) WHERE status = 'active' AND deleted_at IS NULL;

-- Drop old indexes that were automatically renamed from the products table rename
DROP INDEX IF EXISTS public.products_member_id_idx;
DROP INDEX IF EXISTS public.products_shop_id_idx;

-- ============================================================
-- Step 12: updated_at trigger
-- ============================================================

CREATE TRIGGER set_listings_updated_at
  BEFORE UPDATE ON public.listings
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();
