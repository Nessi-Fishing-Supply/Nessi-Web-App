# Recently Viewed Feature

## Overview

Recently viewed tracks listings that the current user has viewed, stored entirely in localStorage. There is no database table — this feature is intentionally client-only and works for both authenticated and unauthenticated users without any API calls. Items are capped at 30, deduplicated (re-added items move to the front), and kept in sync across browser tabs and same-tab navigations.

## Architecture

- **types/recently-viewed.ts** — Lightweight types: `RecentlyViewedItem` (listingId, title, priceCents, thumbnailUrl, viewedAt), `RecentlyViewedStore`
- **utils/recently-viewed-storage.ts** — Pure localStorage utility functions: `getRecentlyViewed`, `addRecentlyViewed` (deduplicate-and-reorder, enforces 30-item cap), `removeRecentlyViewed`, `clearRecentlyViewed`, `isRecentlyViewed`, plus `subscribe` for `useSyncExternalStore` integration (listens to `StorageEvent` filtered by key + custom `nessi_recently_viewed_change` event)
- **hooks/use-recently-viewed.ts** — `useRecentlyViewed()` React hook using `useSyncExternalStore` for hydration-safe localStorage access. Returns `{ items, add, remove, clear, isViewed }`. SSR-safe (empty array on server). Cross-tab sync via `storage` event, same-tab reactivity via custom event.

## Storage

- **localStorage key:** `nessi_recently_viewed` — stores `RecentlyViewedItem[]` as JSON, newest item first
- **30-item cap** — enforced in `addRecentlyViewed`: when the list reaches 30 items the oldest entry (last in array) is dropped before inserting the new one
- **Deduplicate-and-reorder** — if `listingId` already exists in the list, the existing entry is removed and the updated entry is inserted at index 0 (front), preserving the "most recently viewed" ordering and reflecting any updated metadata (title, price, thumbnail)
- **No expiry** — items persist indefinitely in localStorage; there is no TTL or database cleanup trigger

## Sync Strategy

- **Cross-tab sync** — `subscribe` in `recently-viewed-storage.ts` attaches a `storage` event listener on `window`. Events are filtered to `nessi_recently_viewed` key only, so other localStorage writes do not cause spurious re-renders.
- **Same-tab reactivity** — Every mutating function (`addRecentlyViewed`, `removeRecentlyViewed`, `clearRecentlyViewed`) dispatches a `nessi_recently_viewed_change` `CustomEvent` on `window` after writing to localStorage. The `subscribe` function also listens for this event, so the hook re-renders within the same tab without needing a round-trip through the `storage` event (which browsers only fire for other tabs).
- **`useSyncExternalStore` pattern** — `useRecentlyViewed()` calls `useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)` where `getServerSnapshot` returns an empty array for SSR safety and `getSnapshot` reads from localStorage. The snapshot reference is stabilized via JSON.stringify comparison to prevent infinite re-renders when the serialized value has not changed.

## Key Patterns

- **Hydration safety** — `useRecentlyViewed()` uses `useSyncExternalStore` with a server snapshot returning `[]`. This avoids hydration mismatches since localStorage is unavailable during SSR.
- **Snapshot stability** — The hook caches the parsed snapshot reference. A new array reference is only returned when the JSON-serialized value changes, preventing downstream `useEffect` or `useMemo` from firing on every render.
- **No API calls** — This feature never calls any server. All reads and writes are synchronous localStorage operations wrapped in try/catch to handle storage quota errors or private-browsing restrictions gracefully.
- **Metadata snapshot** — `RecentlyViewedItem` captures `title`, `priceCents`, and `thumbnailUrl` at view time. These are displayed in the recently-viewed shelf without any re-fetch. Stale metadata (e.g., price changes) is acceptable for this feature.
- **Pure utilities** — `recently-viewed-storage.ts` has no React imports. All functions are plain TypeScript so they can be tested without a DOM or React tree.

## Hooks

| Hook                   | Purpose                                                                  |
| ---------------------- | ------------------------------------------------------------------------ |
| `useRecentlyViewed()`  | Returns `{ items, add, remove, clear, isViewed }` with live localStorage sync |

## Components

### RecentlyViewedShelf

`components/recently-viewed-shelf/index.tsx` — Client component (`'use client'`) that renders a horizontal scrollable shelf of listing cards for recently viewed items. Hidden when the list is empty.

**Props:** None — reads items internally via `useRecentlyViewed()`.

**Behavior:**

- Renders up to 30 items ordered newest-first
- Hidden when `items.length === 0` (no empty-state UI)
- Each card links to `/listings/{listingId}`
- Images via `next/image` with `sizes="(max-width: 480px) 50vw, 160px"`
- Section heading: "Recently Viewed"

## Related Features

- `src/features/listings/` — Listing entity; `listingId` stored in recently-viewed items
- `src/features/cart/` — Pattern reference for localStorage + `useSyncExternalStore` approach (guest cart)
