---
name: nuxt-app
description: Nuxt 4 full-stack template. Vue 3 (Vapor), Pinia, Tailwind v4, Prisma.
---

# Nuxt 4 Full-Stack Template (2026 Edition)

Mẫu template Full-Stack hiện đại cho Nuxt 4, tối ưu hóa hiệu suất với Vue Vapor Mode và Tailwind v4.

## Tech Stack

| Component | Technology | Version / Notes |
|-----------|------------|-----------------|
| Framework | Nuxt | v4.0+ (App Directory structure) |
| UI Engine | Vue | v3.6+ (Vapor Mode enabled) |
| Language | TypeScript | v5+ (Strict Mode) |
| State | Pinia | v3+ (Store syntax) |
| Database | PostgreSQL | Prisma ORM |
| Styling | Tailwind CSS | v4.0 (Vite Plugin, Zero-config) |
| UI Lib | Nuxt UI | v3 (Tailwind v4 native) |
| Validation | Zod | Schema validation |

---

## Directory Structure (Nuxt 4 Standard)

Sử dụng cấu trúc `app/` để giữ thư mục gốc gọn gàng.

```
project-name/
├── app/                  # Application Source
│   ├── assets/
│   │   └── css/
│   │       └── main.css  # Tailwind v4 imports
│   ├── components/       # Auto-imported components
│   ├── composables/      # Auto-imported logic
│   ├── layouts/
│   ├── pages/            # File-based routing
│   ├── app.vue           # Root component
│   └── router.options.ts
├── server/               # Nitro Server Engine
│   ├── api/              # API Routes (e.g. /api/users)
│   ├── routes/           # Server Routes
│   └── utils/            # Server-only helpers (Prisma)
├── prisma/
│   └── schema.prisma
├── public/
├── nuxt.config.ts        # Main Config
└── package.json
```

---

## Key Concepts (2026)

| Concept | Description | Future Update |
|---------|-------------|---------------|
| **App Directory** | `app/` | Tách biệt mã nguồn ứng dụng và file cấu hình root. |
| **Vapor Mode** | Opt-in performance | Render không cần Virtual DOM (như SolidJS). Bật trong `nuxt.config`. |
| **Server Functions** | RPC-style calls | Gọi hàm server trực tiếp từ client (thay thế dần API routes thủ công). |
| **Tailwind v4** | CSS-first | Cấu hình theme trực tiếp trong CSS, không cần `tailwind.config.js`. |
| **Nuxt Islands** | Server Components | Render component cô lập trên server (`<NuxtIsland name="..." />`). |

---

## Environment Variables

| Variable | Purpose |
|----------|---------|
| DATABASE_URL | Prisma connection string (PostgreSQL) |
| NUXT_PUBLIC_APP_URL | Canonical URL |
| NUXT_SESSION_PASSWORD | Session encryption key |

---

## Setup Steps

1. Initialize Project:
   ```bash
   npx nuxi@latest init my-app
   # Select "Nuxt 4 structure" if prompted
   ```

2. Install Core Deps:
   ```bash
   npm install @pinia/nuxt @prisma/client zod
   npm install -D prisma
   ```

3. Setup Tailwind v4:
   Install the Vite plugin (new standard):
   ```bash
   npm install tailwindcss @tailwindcss/vite
   ```

   Add to `nuxt.config.ts`:
   ```ts
   import tailwindcss from '@tailwindcss/vite'
   export default defineNuxtConfig({
     vite: {
       plugins: [tailwindcss()]
     },
     css: ['~/assets/css/main.css']
   })
   ```

4. Configure CSS:
   In `app/assets/css/main.css`:
   ```css
   @import "tailwindcss";
   @theme {
     --color-primary: oklch(0.6 0.15 150);
   }
   ```

5. Run Development:
   ```bash
   npm run dev
   # Runs with Turbo/Vite
   ```

---

## Best Practices

- **Vapor Mode**: Kích hoạt cho các component nặng về render:
  ```ts
  <script setup lang="ts" vapor>
  // Component này sẽ compile sang chế độ Vapor (No VDOM)
  </script>
  ```
- **Data Fetching**: Sử dụng `useFetch` với `server: false` cho các tác vụ client-only, hoặc dùng Server Functions để type-safety tốt hơn.
- **State**: Dùng `defineStore` (Pinia) cho global state, `useState` của Nuxt cho state đơn giản chia sẻ giữa Server/Client.
- **Type Safety**: Tự động tạo type cho API routes (`$fetch` typed automatically).
