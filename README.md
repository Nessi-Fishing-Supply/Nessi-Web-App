# Nessi Web App

A modern e-commerce web application built with Next.js, Supabase authentication, and Drizzle ORM for database management.

![Nessi Web App Logo](/src/assets/logos/logo_full.svg)

## Overview

Nessi Web App is a feature-rich e-commerce platform that allows users to:

- Create and manage user accounts with secure authentication
- Browse, search, and filter products
- View detailed product information and images
- Add products to sell with multiple images
- Manage their product listings in a personalized dashboard

## Tech Stack

- **Frontend**:
  - [Next.js 15](https://nextjs.org/) (React 19) with App Router
  - [SASS/SCSS](https://sass-lang.com/) for styling
  - [React Hook Form](https://react-hook-form.com/) with Yup validation
  - [Swiper](https://swiperjs.com/) for carousels and image galleries

- **Backend**:
  - [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
  - [Supabase](https://supabase.com/) for authentication
  - [Drizzle ORM](https://orm.drizzle.team/) for database operations
  - [Neon Database](https://neon.tech/) (PostgreSQL) for data storage
  - [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) for asset storage

- **Deployment**:
  - Optimized for deployment on [Vercel](https://vercel.com/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [PNPM](https://pnpm.io/) (v10.13.1 or higher)
- A [Vercel](https://vercel.com/) account with access to the Nessi Web App team

### Environment Setup

After cloning the repository, link your local project to the Vercel project and pull the environment variables:

```bash
# Install Vercel CLI if you don't have it
npm i -g vercel

# Link to the Vercel project
vercel link

# Pull environment variables
vercel env pull .env.local
```

This will automatically set up all necessary environment variables including Supabase, Neon Database, and Vercel Blob credentials.

### Installation

1. Clone the repository:

```bash
git clone https://your-repository-url/nessi-web-app.git
cd nessi-web-app
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm dev
```

Note: The database should already be set up in the Vercel environment. If you need to make schema changes, consult with the team lead before running any database commands.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Database Management

Nessi Web App uses Drizzle ORM with a PostgreSQL database. The project includes several useful commands for database management:

- `pnpm db:generate` - Generate migration files from your schema
- `pnpm db:migrate` - Apply migrations to your database
- `pnpm db:studio` - Open Drizzle Studio to visually manage your database
- `pnpm db:pull` - Pull the latest database schema
- `pnpm db:check` - Check for schema drift

## Project Structure

```
├── src/
│   ├── app/                   # Next.js App Router pages and API routes
│   ├── assets/                # Static assets (icons, logos)
│   ├── components/            # React components organized by type
│   ├── context/               # React context providers
│   ├── db/                    # Database schema and configurations
│   ├── hooks/                 # Custom React hooks
│   ├── libs/                  # Utility libraries and configurations
│   ├── services/              # API service functions
│   ├── styles/                # Global styles and variables
│   ├── types/                 # TypeScript type definitions
│   └── validations/           # Form validation schemas
├── drizzle.config.ts         # Drizzle ORM configuration
└── next.config.mjs           # Next.js configuration
```

## Features

- **Authentication**
  - Email/password registration and login
  - Social authentication with Google, Apple, and Facebook
  - Password recovery

- **User Dashboard**
  - Account management
  - Product listing management

- **Product Management**
  - Create, read, update, and delete products
  - Multiple image uploads per product
  - Pricing and description management

## Contributing

This is an enterprise codebase with restricted access. Contributions are by invitation only. Please contact the project administrators if you need access or have questions about the codebase.

## License

This project is proprietary and confidential. Unauthorized use, reproduction, or distribution is prohibited.
