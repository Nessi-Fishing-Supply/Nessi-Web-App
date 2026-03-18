# Nessi Web App

A C2C e-commerce marketplace built with Next.js, Supabase, and deployed on Vercel.

![Nessi Web App Logo](/src/assets/logos/logo_full.svg)

## Overview

Nessi is a consumer-to-consumer marketplace where users can:

- Create and manage accounts with secure authentication
- Browse and search product listings
- View detailed product information with image galleries
- List products for sale with multiple images
- Manage listings in a personalized dashboard

## Tech Stack

- **Frontend**: [Next.js 16](https://nextjs.org/) (React 19) with App Router, SCSS Modules
- **Backend**: Next.js API Routes, [Supabase](https://supabase.com/) (Auth, PostgreSQL, Storage)
- **Deployment**: [Vercel](https://vercel.com/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) LTS (v24+) — use `nvm use` to auto-select
- [pnpm](https://pnpm.io/) (v10.13.1+)

### Setup

```bash
git clone https://github.com/Nessi-Fishing-Supply/Nessi-Web-App.git
cd nessi-web-app
pnpm install
```

Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials, or pull from Vercel:

```bash
vercel link
vercel env pull .env.local
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script              | Description                         |
| ------------------- | ----------------------------------- |
| `pnpm dev`          | Start dev server                    |
| `pnpm build`        | Production build                    |
| `pnpm lint`         | ESLint                              |
| `pnpm lint:styles`  | Stylelint (SCSS)                    |
| `pnpm typecheck`    | TypeScript type checking            |
| `pnpm format`       | Prettier (write)                    |
| `pnpm format:check` | Prettier (verify)                   |
| `pnpm test`         | Vitest (watch)                      |
| `pnpm test:run`     | Vitest (single run)                 |
| `pnpm db:types`     | Generate types from Supabase schema |

## Project Structure

```
src/
├── features/           # Domain logic (auth, products, shared)
│   ├── auth/           # Auth services, types, validations, components
│   ├── products/       # Product services, types, components
│   └── shared/         # Shared hooks and types
├── components/         # Shared UI components (controls, layout, navigation)
├── app/                # Next.js routing layer and API routes
├── libs/supabase/      # Supabase client utilities
├── types/              # Generated types (database.ts)
├── styles/             # Global SCSS variables, mixins, utilities
└── assets/             # Static assets (icons, logos)
```

## License

Proprietary and confidential. Unauthorized use, reproduction, or distribution is prohibited.
