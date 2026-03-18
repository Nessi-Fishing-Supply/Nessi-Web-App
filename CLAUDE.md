# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Nessi is an e-commerce web application built with Next.js 15 (App Router), Supabase Auth, Drizzle ORM on Neon PostgreSQL, and deployed on Vercel.

## Commands

- **Dev server:** `pnpm dev`
- **Build:** `pnpm build`
- **Lint:** `pnpm lint`
- **DB generate migrations:** `pnpm db:generate`
- **DB push schema:** `pnpm db:migrate`
- **DB studio:** `pnpm db:studio`

Package manager is **pnpm** (v10.13.1). Do not use npm or yarn.

## Architecture

### Routing

Next.js App Router with a `(frontend)` route group for all UI pages. No Pages Router usage.

### Authentication

- **Server-side:** API routes in `src/app/api/auth/` call Supabase using a service role client from `src/libs/supabase.ts`
- **Client-side:** `src/context/auth.tsx` provides an `AuthProvider`/`useAuth` context that stores auth state in localStorage
- User ID is passed to product API routes via the `x-user-id` header

### Database

- Drizzle ORM configured in `src/libs/db.ts` connecting to Neon PostgreSQL
- Schema defined in `src/db/schema/` (products + productImages tables with relations)
- Drizzle config in `drizzle.config.ts`, migrations output to `migrations/`

### File Storage

Image uploads use Vercel Blob via `src/app/api/products/upload/route.ts`.

### Key Directories

- `src/app/api/` — API routes (auth, products, upload)
- `src/components/` — React components organized by type: cards, controls, forms, layout, navigation, indicators
- `src/services/` — Client-side API service functions (axios-based)
- `src/hooks/` — Custom hooks for form handling
- `src/validations/` — Yup validation schemas
- `src/types/` — TypeScript type definitions
- `src/styles/` — SCSS with variables, mixins, and utilities

### Styling

SCSS with CSS Modules for component-scoped styles. Global variables in `src/styles/variables/`, responsive breakpoints in `src/styles/mixins/breakpoints.scss`.

### Path Alias

`@/*` maps to `./src/*` (configured in tsconfig.json).

## Environment Variables

Required in `.env.local`: `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `BLOB_READ_WRITE_TOKEN`, `NEXT_PUBLIC_APP_URL`.

## ESLint

Extends `next/core-web-vitals` and `next/typescript`. `@typescript-eslint/no-explicit-any` is disabled.
