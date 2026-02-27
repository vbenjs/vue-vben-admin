---
name: nextjs-saas
description: Next.js SaaS template principles (2026 Standards). React 19, Server Actions, Auth.js v6.
---

# Next.js SaaS Template (Updated 2026)

## Tech Stack

| Component | Technology | Version / Notes |
|-----------|------------|-----------------|
| Framework | Next.js | v16+ (App Router, React Compiler) |
| Runtime | Node.js | v24 (Krypton LTS) |
| Auth | Auth.js | v6 (formerly NextAuth) |
| Payments | Stripe API | Latest |
| Database | PostgreSQL | Prisma v6 (Serverless Driver) |
| Email | Resend | React Email |
| UI | Tailwind CSS | v4 (Oxide Engine, no config file) |

---

## Directory Structure

```
project-name/
├── prisma/
│   └── schema.prisma    # Database Schema
├── src/
│   ├── actions/         # NEW: Server Actions (Replaces API Routes for data mutation)
│   │   ├── auth-actions.ts
│   │   ├── billing-actions.ts
│   │   └── user-actions.ts
│   ├── app/
│   │   ├── (auth)/      # Route Group: Login, register
│   │   ├── (dashboard)/ # Route Group: Protected routes (App Layout)
│   │   ├── (marketing)/ # Route Group: Landing, pricing (Marketing Layout)
│   │   └── api/         # Only used for Webhooks or Edge cases
│   │       └── webhooks/stripe/
│   ├── components/
│   │   ├── emails/      # React Email templates
│   │   ├── forms/       # Client components using useActionState (React 19)
│   │   └── ui/          # Shadcn UI
│   ├── lib/
│   │   ├── auth.ts      # Auth.js v6 config
│   │   ├── db.ts        # Prisma Singleton
│   │   └── stripe.ts    # Stripe Singleton
│   └── styles/
│       └── globals.css  # Tailwind v4 imports (CSS only)
└── package.json
```

---

## SaaS Features

| Feature | Implementation |
|---------|---------------|
| Auth | Auth.js v6 + Passkeys + OAuth |
| Data Mutation | Server Actions (No API routes) |
| Subscriptions | Stripe Checkout & Customer Portal |
| Webhooks | Asynchronous Stripe event handling |
| Email | Transactional via Resend |
| Validation | Zod (Server-side validation) |

---

## Database Schema

| Model | Fields (Key fields) |
|-------|---------------------|
| User | id, email, stripeCustomerId, subscriptionId, plan |
| Account | OAuth provider data (Google, GitHub...) |
| Session | User sessions (Database strategy) |

---

## Environment Variables

| Variable | Purpose |
|----------|---------|
| DATABASE_URL | Prisma connection string (Postgres) |
| AUTH_SECRET | Replaces NEXTAUTH_SECRET (Auth.js v6) |
| STRIPE_SECRET_KEY | Payments (Server-side) |
| STRIPE_WEBHOOK_SECRET | Webhook verification |
| RESEND_API_KEY | Email sending |
| NEXT_PUBLIC_APP_URL | Application Canonical URL |

---

## Setup Steps

1. Initialize project (Node 24):
   ```bash
   npx create-next-app@latest {{name}} --typescript --eslint
   ```

2. Install core libraries:
   ```bash
   npm install next-auth@beta stripe resend @prisma/client
   ```

3. Install Tailwind v4 (Add to globals.css):
   ```css
   @import "tailwindcss";
   ```

4. Configure environment (.env.local)

5. Sync Database:
   ```bash
   npx prisma db push
   ```

6. Run local Webhook:
   ```bash
   npm run stripe:listen
   ```

7. Run project:
   ```bash
   npm run dev
   ```
