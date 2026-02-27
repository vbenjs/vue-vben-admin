---
name: nextjs-fullstack
description: Next.js full-stack template principles. App Router, Prisma, Tailwind v4.
---

# Next.js Full-Stack Template (2026 Edition)

## Tech Stack

| Component | Technology | Version / Notes |
|-----------|------------|-----------------|
| Framework | Next.js | v16+ (App Router, Turbopack) |
| Language | TypeScript | v5+ (Strict Mode) |
| Database | PostgreSQL | Prisma ORM (Serverless friendly) |
| Styling | Tailwind CSS | v4.0 (Zero-config, CSS-first) |
| Auth | Clerk / Better Auth | Middleware Protected Routes |
| UI Logic | React 19 | Server Actions, useActionState |
| Validation | Zod | Schema validation (API & Forms) |

---

## Directory Structure

```
project-name/
├── prisma/
│   └── schema.prisma       # Database schema
├── src/
│   ├── app/
│   │   ├── (auth)/         # Route groups for Login/Register
│   │   ├── (dashboard)/    # Protected routes
│   │   ├── api/            # Route Handlers (only for Webhooks/External integration)
│   │   ├── layout.tsx      # Root Layout (Metadata, Providers)
│   │   ├── page.tsx        # Landing Page
│   │   └── globals.css     # Tailwind v4 config (@theme) lives here
│   ├── components/
│   │   ├── ui/             # Reusable UI (Button, Input)
│   │   └── forms/          # Client forms using useActionState
│   ├── lib/
│   │   ├── db.ts           # Prisma singleton client
│   │   ├── utils.ts        # Helper functions
│   │   └── dal.ts          # Data Access Layer (Server-only)
│   ├── actions/            # Server Actions (Mutations)
│   └── types/              # Global TS Types
├── public/
├── next.config.ts          # TypeScript Config
└── package.json
```

---

## Key Concepts (Updated)

| Concept | Description |
|---------|-------------|
| Server Components | Render on server (default). Direct DB access (Prisma) without APIs. |
| Server Actions | Handle Form mutations. Replaces traditional API Routes. Use in action={}. |
| React 19 Hooks | Form state management: useActionState, useFormStatus, useOptimistic. |
| Data Access Layer | Data security. Separation of DB logic (DTOs) for safe reuse. |
| Tailwind v4 | Styling engine. No tailwind.config.js. Config directly in CSS. |

---

## Environment Variables

| Variable | Purpose |
|----------|---------|
| DATABASE_URL | PostgreSQL connection string (Prisma) |
| NEXT_PUBLIC_APP_URL | Public application URL |
| NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY | Auth (if using Clerk) |
| CLERK_SECRET_KEY | Auth Secret (Server only) |

---

## Setup Steps

1. Initialize Project:
   ```bash
   npx create-next-app@latest my-app --typescript --tailwind --eslint
   # Select Yes for App Router
   # Select No for src directory (optional, this template uses src)
   ```

2. Install DB & Validation:
   ```bash
   npm install prisma @prisma/client zod
   npm install -D ts-node # For running seed scripts
   ```

3. Configure Tailwind v4 (If missing):
   Ensure `src/app/globals.css` uses the new import syntax instead of a config file:
   ```css
   @import "tailwindcss";

   @theme {
     --color-primary: oklch(0.5 0.2 240);
     --font-sans: "Inter", sans-serif;
   }
   ```

4. Initialize Database:
   ```bash
   npx prisma init
   # Update schema.prisma
   npm run db:push
   ```

5. Run Developer Server:
   ```bash
   npm run dev --turbo
   # --turbo to enable faster Turbopack
   ```

---

## Best Practices (2026 Standards)

- **Fetch Data**: Call Prisma directly in Server Components (async/await). Do not use useEffect for initial data fetching.
- **Mutations**: Use Server Actions combined with React 19's `useActionState` to handle loading and error states instead of manual useState.
- **Type Safety**: Share Zod schemas between Server Actions (input validation) and Client Forms.
- **Security**: Always validate input data with Zod before passing it to Prisma.
- **Styling**: Use native CSS variables in Tailwind v4 for easier dynamic theming.
