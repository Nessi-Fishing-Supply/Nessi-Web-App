# Watchlist Feature

> Initial scaffold — will be updated after implementation.

Part of the price-drop notification system. Allows authenticated members to watch listings and receive email notifications when the price drops.

## Overview

Members can watch any active listing. When a seller reduces the price, watched listings are queued into `price_drop_notifications`. A cron job (or Supabase Edge Function) processes the queue and sends emails to all watchers via Resend.

Watcher counts are denormalized onto `listings.watcher_count` for fast display in the seller's quick-edit price modal without joins.

## Database Schema

### `watchers` table

| Column                      | Type        | Constraints                                   |
| --------------------------- | ----------- | --------------------------------------------- |
| `id`                        | UUID        | PK, `gen_random_uuid()`                       |
| `listing_id`                | UUID        | NOT NULL, FK `listings(id) ON DELETE CASCADE` |
| `user_id`                   | UUID        | NOT NULL, FK `members(id) ON DELETE CASCADE`  |
| `watched_at`                | TIMESTAMPTZ | NOT NULL, DEFAULT `now()`                     |
| `last_notified_price_cents` | INTEGER     | NULL — tracks last notified price             |

**Constraints:**

- `UNIQUE (listing_id, user_id)` — prevents duplicate watches

**Indexes:**

- `watchers_listing_id_idx` on `listing_id`
- `watchers_user_id_idx` on `user_id`

### `price_drop_notifications` table

| Column            | Type        | Constraints                                   |
| ----------------- | ----------- | --------------------------------------------- |
| `id`              | UUID        | PK, `gen_random_uuid()`                       |
| `listing_id`      | UUID        | NOT NULL, FK `listings(id) ON DELETE CASCADE` |
| `old_price_cents` | INTEGER     | NOT NULL                                      |
| `new_price_cents` | INTEGER     | NOT NULL                                      |
| `processed`       | BOOLEAN     | NOT NULL, DEFAULT `false`                     |
| `created_at`      | TIMESTAMPTZ | NOT NULL, DEFAULT `now()`                     |

**Notes:**

- Rows are inserted when a listing price drops (via DB trigger on `listings` UPDATE)
- The cron pipeline reads `processed = false` rows, fans out emails to watchers, then marks rows `processed = true`
- One notification row per price drop event (not per watcher) — the cron job resolves watchers at send time

### Denormalized `watcher_count`

`listings.watcher_count INTEGER NOT NULL DEFAULT 0` is maintained by a DB trigger:

- **INSERT** on `watchers` → increments `listings.watcher_count`
- **DELETE** on `watchers` → decrements `listings.watcher_count` (clamped to 0 via `GREATEST`)

The watcher count is displayed in the seller's `QuickEditPrice` modal to signal demand.

### RLS Policies

| Policy                                  | Operation | Roles         | Rule                                         |
| --------------------------------------- | --------- | ------------- | -------------------------------------------- |
| Users can view own watches              | SELECT    | authenticated | `USING (user_id = auth.uid())`               |
| Users can insert own watches            | INSERT    | authenticated | `WITH CHECK (user_id = auth.uid())`          |
| Users can delete own watches            | DELETE    | authenticated | `USING (user_id = auth.uid())`               |
| price_drop_notifications are not public | SELECT    | authenticated | Read-only via service role (cron processing) |

## Architecture

- **types/watcher.ts** — Database-derived types: `Watcher` (Row), `WatcherInsert`, `WatchStatus` (`{ is_watching: boolean }`), `WatchedListing` (listing with photos + `watched_at`), `PriceDropNotification` (Row)
- **services/watcher-server.ts** — Server-side Supabase queries: `createWatcherServer`, `deleteWatcherServer`, `getWatchStatusServer`, `getWatchedListingsServer`
- **services/watcher.ts** — Client-side fetch wrappers: `watchListing`, `unwatchListing`, `getWatchStatus`, `getWatchedListings`
- **hooks/use-watch-status.ts** — `useWatchStatus(listingId)`: query key `['watchlist', 'status', listingId]`
- **hooks/use-watch-toggle.ts** — `useWatchToggle({ listingId, onSuccess?, onError? })`: mutation with optimistic updates to status and watcher count caches
- **hooks/use-watched-listings.ts** — `useWatchedListings()`: query key `['watchlist', 'listings']`, returns `WatchedListing[]`

## API Routes

| Method | Route                     | Auth Required | Description                                           |
| ------ | ------------------------- | ------------- | ----------------------------------------------------- |
| POST   | `/api/watchlist`          | Yes           | Watch a listing (409 on duplicate)                    |
| DELETE | `/api/watchlist`          | Yes           | Unwatch a listing (params via query string)           |
| GET    | `/api/watchlist/status`   | Yes           | Check if the authenticated user is watching a listing |
| GET    | `/api/watchlist/listings` | Yes           | List all listings the authenticated user is watching  |

## Cron Pipeline

Price-drop notifications are processed asynchronously:

1. DB trigger inserts a `price_drop_notifications` row when `listings.price_cents` decreases
2. Cron job (Supabase Edge Function or Vercel cron) queries `processed = false` rows
3. For each notification: fetch watchers for `listing_id`, send email via Resend, update `watchers.last_notified_price_cents`
4. Mark the notification row `processed = true`

## Components

- **WatchButton** — Watch/unwatch toggle button. `aria-pressed`, `aria-label`, `aria-busy`. Auth gate: unauthenticated users see a sign-in toast.
- **WatchedListingCard** — Card for the `/dashboard/watchlist` page. Shows listing thumbnail, title, price, price drop badge (if applicable), and unwatch button.

## Directory Structure

```
src/features/watchlist/
├── CLAUDE.md
├── index.ts                              # Barrel export (types + hooks + components)
├── types/
│   └── watcher.ts                        # Watcher, WatcherInsert, WatchStatus, WatchedListing, PriceDropNotification
├── services/
│   ├── watcher-server.ts                 # Server-side Supabase queries
│   └── watcher.ts                        # Client-side fetch wrappers
├── hooks/
│   ├── use-watch-status.ts               # Query: is the user watching?
│   ├── use-watch-toggle.ts               # Mutation: watch/unwatch with optimistic updates
│   └── use-watched-listings.ts           # Query: list of watched listings
└── components/
    ├── watch-button/
    │   ├── index.tsx
    │   └── watch-button.module.scss
    └── watched-listing-card/
        ├── index.tsx
        └── watched-listing-card.module.scss

src/app/api/watchlist/
├── route.ts                              # POST (watch), DELETE (unwatch)
├── status/
│   └── route.ts                          # GET watch status
└── listings/
    └── route.ts                          # GET watched listings
```

## Key Patterns

- Follows the same shape as `src/features/follows/` — polymorphic target replaced by a direct `listing_id` FK
- Optimistic updates in `useWatchToggle` mirror the `useFollowToggle` pattern: cancel in-flight queries, snapshot, update cache, revert on error
- DELETE via query params (not body) — same rationale as `unfollowTarget`
- Auth gate on `WatchButton` — unauthenticated users see a sign-in toast, not a redirect

## Related Features

- `src/features/listings/` — `watcher_count` on listings table; `QuickEditPrice` displays watcher count
- `src/features/email/` — Resend client used by the cron pipeline to send price-drop emails
- `src/features/follows/` — Reference pattern for watch/unwatch toggle + optimistic updates
