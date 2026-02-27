---
name: nextjs-static
description: Modern template for Next.js 16, React 19 & Tailwind v4. Optimized for Landing pages and Portfolios.
---

# Next.js Static Site Template (Modern Edition)

## Tech Stack

| Component | Technology | Notes |
|-----------|------------|-------|
| Framework | Next.js 16+ | App Router, Turbopack, Static Exports |
| Core | React 19 | Server Components, New Hooks, Compiler |
| Language | TypeScript | Strict Mode |
| Styling | Tailwind CSS v4 | CSS-first configuration (No js config), Oxide Engine |
| Animations | Framer Motion | Layout animations & gestures |
| Icons | Lucide React | Lightweight SVG icons |
| SEO | Metadata API | Native Next.js API (Replaces next-seo) |

---

## Directory Structure

Streamlined structure thanks to Tailwind v4 (theme configuration lives inside CSS).

```
project-name/
├── src/
│   ├── app/
│   │   ├── layout.tsx    # Contains root SEO Metadata
│   │   ├── page.tsx      # Landing Page
│   │   ├── globals.css   # Import Tailwind v4 & @theme config
│   │   ├── not-found.tsx # Custom 404 page
│   │   └── (routes)/     # Route groups (about, contact...)
│   ├── components/
│   │   ├── layout/       # Header, Footer
│   │   ├── sections/     # Hero, Features, Pricing, CTA
│   │   └── ui/           # Atomic components (Button, Card)
│   └── lib/
│       └── utils.ts      # Helper functions (cn, formatters)
├── content/              # Markdown/MDX content
├── public/               # Static assets (images, fonts)
├── next.config.ts        # Next.js Config (TypeScript)
└── package.json
```

---

## Static Export Config

Using `next.config.ts` instead of `.js` for better type safety.

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',        // Required for Static Hosting (S3, GitHub Pages)
  images: { 
    unoptimized: true      // Required if not using Node.js server image optimization
  },
  trailingSlash: true,     // Recommended for SEO and fixing 404s on some hosts
  reactStrictMode: true,
};

export default nextConfig;
```

---

## SEO Implementation (Metadata API)

Deprecated next-seo. Configure directly in layout.tsx or page.tsx.

```typescript
// src/app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Product Name',
    default: 'Home - Product Name',
  },
  description: 'SEO optimized description for the landing page.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mysite.com',
    siteName: 'My Brand',
  },
};
```

---

## Landing Page Sections

| Section | Purpose | Suggested Component |
|---------|---------|---------------------|
| Hero | First impression, H1 & Main CTA | `<HeroSection />` |
| Features | Product benefits (Grid/Bento layout) | `<FeaturesGrid />` |
| Social Proof | Partner logos, User numbers | `<LogoCloud />` |
| Testimonials | Customer reviews | `<TestimonialCarousel />` |
| Pricing | Service plans | `<PricingCards />` |
| FAQ | Questions & Answers (Good for SEO) | `<Accordion />` |
| CTA | Final conversion | `<CallToAction />` |

---

## Animation Patterns (Framer Motion)

| Pattern | Usage | Implementation |
|---------|-------|----------------|
| Fade Up | Headlines, paragraphs | `initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}` |
| Stagger | Lists of Features/Cards | Use variants with `staggerChildren` |
| Parallax | Background images or floating elements | `useScroll` & `useTransform` |
| Micro-interactions | Hover buttons, click effects | `whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}` |

---

## Setup Steps

1. Initialize Project:
   ```bash
   npx create-next-app@latest my-site --typescript --tailwind --eslint
   # Select 'Yes' for App Router
   # Select 'No' for 'Would you like to customize the default import alias?'
   ```

2. Install Auxiliary Libraries:
   ```bash
   npm install framer-motion lucide-react clsx tailwind-merge
   # clsx and tailwind-merge help handle dynamic classes better
   ```

3. Configure Tailwind v4 (in `src/app/globals.css`):
   ```css
   @import "tailwindcss";

   @theme {
     --color-primary: #3b82f6;
     --font-sans: 'Inter', sans-serif;
   }
   ```

4. Development:
   ```bash
   npm run dev --turbopack
   ```

---

## Deployment

| Platform | Method | Important Notes |
|----------|--------|-----------------|
| Vercel | Git Push | Auto-detects Next.js. Best for performance. |
| GitHub Pages | GitHub Actions | Need to set `basePath` in `next.config.ts` if not using a custom domain. |
| AWS S3 / CloudFront | Upload out folder | Ensure Error Document is configured to `404.html`. |
| Netlify | Git Push | Set build command to `npm run build`. |

---

## Best Practices (Modern)

- **React Server Components (RSC)**: Default all components to Server Components. Only add `'use client'` when you need state (`useState`) or event listeners (`onClick`).
- **Image Optimization**: Use the `<Image />` component but remember `unoptimized: true` for static export or use an external image CDN (Cloudinary/Imgix).
- **Font Optimization**: Use `next/font` (Google Fonts) to automatically host fonts and prevent layout shift.
- **Responsive**: Mobile-first design using Tailwind prefixes like `sm:`, `md:`, `lg:`.
