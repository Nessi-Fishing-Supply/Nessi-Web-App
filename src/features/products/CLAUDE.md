# Products Feature

## Overview
Product management feature with CRUD operations, image uploads via Vercel Blob, and product display components.

## Architecture
- **services/product.ts** — Client-side product API functions (CRUD + image upload via axios)
- **types/product.ts** — Database-derived types (Product, ProductImage, ProductWithImages)

## API Routes
Product API routes live in `src/app/api/products/`:
- `route.ts` — GET all products, POST create product
- `[id]/route.ts` — GET/PUT/DELETE single product
- `user/route.ts` — GET current user's products
- `upload/route.ts` — POST image upload to Vercel Blob

## Components
- **product-card** — Product display card with image carousel (Swiper), pricing, reviews, favorites
- **add-product-form** — Form for creating new products with multi-image upload
- **product-reviews** — Star rating display component
- **favorite** — Heart toggle button component

## Key Patterns
- Images uploaded to Vercel Blob, URLs stored in `product_images` table
- Product types derived from Supabase database schema via `@/types/database`
- Product card uses Swiper for image carousel with navigation/pagination
