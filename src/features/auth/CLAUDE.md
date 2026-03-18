# Auth Feature

## Overview

Authentication feature using Supabase Auth with cookie-based sessions via `@supabase/ssr`.

## Architecture

- **context.tsx** — `AuthProvider` and `useAuth()` hook wrapping Supabase session state (client-side)
- **services/auth.ts** — Client-side auth API functions (login, register, logout, password reset)
- **types/auth.ts** — Auth data interfaces (RegisterData, LoginData, ResetPasswordData, AuthResponse)
- **types/forms.ts** — Auth form prop interfaces and form data types (AuthFormProps, LoginFormData, etc.)
- **validations/auth.ts** — Yup schemas for login, registration, and password reset forms

## Session Flow

1. `proxy.ts` refreshes Supabase sessions on every request (server-side)
2. `AuthProvider` listens to `onAuthStateChange` for client-side state
3. Auth forms call services which use the Supabase browser client
4. Registration goes through `/api/auth/register` (uses admin client to bypass RLS)

## Key Patterns

- Cookie-based sessions — no localStorage tokens
- Server-side: API routes use server client from `src/libs/supabase/server.ts`
- Client-side: Components use browser client from `src/libs/supabase/client.ts`
- Admin operations: Registration uses admin client from `src/libs/supabase/admin.ts`

## Components

- **login-form** — Email/password login with redirect support
- **registration-form** — New user signup with email verification
- **forgot-password-form** — Password reset email request
- **reset-password-form** — New password entry after reset link
