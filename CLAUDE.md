# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 13.5 design agency website with two main sections:
- Main landing page: Premium design subscription service
- `/design-for-good`: Dedicated product offering for non-profits

## Key Commands

```bash
# Development
npm run dev           # Start development server on localhost:3000

# Build & Production
npm run build         # Build production bundle
npm run start         # Start production server

# Code Quality
npm run lint          # Run ESLint
```

## Architecture & Structure

### Tech Stack
- **Framework**: Next.js 13.5 with App Router
- **UI Components**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS with custom premium design system
- **Forms**: React Hook Form with Zod validation
- **Integrations**: Stripe (payments), Trello (lead management)

### Core Application Structure

The app uses Next.js App Router with the following organization:

- **`/app`**: Main application routes
  - `page.tsx`: Landing page with multiple sections
  - `design-for-good/page.tsx`: Separate non-profit offering
  - `api/`: API routes for Stripe, Trello, and contact form

- **`/components`**: Reusable components split by concern
  - Main landing page components (Hero, Services, Team, etc.)
  - `designForGood/`: Components specific to the non-profit page
  - `ui/`: shadcn/ui component library (Radix UI based)

- **`/data`**: JSON data files for content management
  - Separate data for each component/section
  - `portfolio/projects/`: Individual portfolio project data

### Design System

Custom premium design tokens defined in `tailwind.config.ts`:
- **Colors**: ink, smoke, ash, pearl, silk, mist, flame, ember, coral, ocean
- **Typography**: Custom font scales (hero, display, section, subsection)
- **Animations**: fade-in variants, underline-reveal, loop-horizontally
- **Sharp edges**: All border-radius set to 0 for modern aesthetic

### Key Integrations

1. **Brevo CRM & Email Marketing** (`/lib/brevo.ts`) - PRIMARY CRM
   - Requires: `BREVO_API_KEY`
   - Features: Contact management, transactional emails, marketing automation
   - Handles all contact form submissions with auto-emails
   - Syncs with Stripe customers automatically via webhooks
   - Sends: welcome emails, notifications, receipts, subscription updates

2. **Stripe Payment Processing** (`/lib/stripe.ts`)
   - Requires: `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
   - API version: 2024-11-20.acacia
   - Webhook endpoint: `/api/stripe-webhook` syncs all customer events to Brevo
   - Handles: subscriptions, payments, invoices, customer lifecycle

3. **Trello** (`/lib/trello.ts`) - LEGACY/OPTIONAL
   - Status: Replaced by Brevo for contact management
   - Code preserved but commented out in `/app/api/contact/route.ts`
   - Can be re-enabled if specific Trello workflows are needed

### TypeScript Configuration

- Strict mode enabled
- Path alias: `@/*` maps to root directory
- Target: ES5 with modern lib features

### Important Patterns

- Dynamic imports for client-side only components (e.g., Navigation)
- Data-driven components using JSON files in `/data`
- Consistent section-based page structure with ID anchors
- Premium aesthetic with sharp edges (no border-radius)
- Heavy use of Radix UI primitives through shadcn/ui