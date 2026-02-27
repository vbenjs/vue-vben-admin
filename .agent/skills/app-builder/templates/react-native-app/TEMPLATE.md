---
name: react-native-app
description: React Native mobile app template principles. Expo, TypeScript, navigation.
---

# React Native App Template (2026 Edition)

Modern mobile app template, optimized for New Architecture and React 19.

## Tech Stack

| Component | Technology | Version / Notes |
|-----------|------------|-----------------|
| Core | React Native + Expo | SDK 52+ (New Architecture Enabled) |
| Language | TypeScript | v5+ (Strict Mode) |
| UI Logic | React | v19 (React Compiler, auto-memoization) |
| Navigation | Expo Router | v4+ (File-based, Universal Links) |
| Styling | NativeWind | v4.0 (Tailwind v4, CSS-first config) |
| State | Zustand + React Query | v5+ (Async State Management) |
| Storage | Expo SecureStore | Encrypted local storage |

---

## Directory Structure

Standardized structure for Expo Router and NativeWind v4.

```
project-name/
├── app/                 # Expo Router (File-based routing)
│   ├── _layout.tsx      # Root Layout (Stack/Tabs config)
│   ├── index.tsx        # Main Screen
│   ├── (tabs)/          # Route Group for Tab Bar
│   │   ├── _layout.tsx
│   │   ├── home.tsx
│   │   └── profile.tsx
│   ├── +not-found.tsx   # 404 Page
│   └── [id].tsx         # Dynamic Route (Typed)
├── components/
│   ├── ui/              # Primitive Components (Button, Text)
│   └── features/        # Complex Components
├── hooks/               # Custom Hooks
├── lib/
│   ├── api.ts           # Axios/Fetch client
│   └── storage.ts       # SecureStore wrapper
├── store/               # Zustand stores
├── constants/           # Colors, Theme config
├── assets/              # Fonts, Images
├── global.css           # Entry point for NativeWind v4
├── tailwind.config.ts   # Tailwind Config (if custom theme needed)
├── babel.config.js      # NativeWind Babel Plugin
└── app.json             # Expo Config
```

---

## Navigation Patterns (Expo Router)

| Pattern | Description | Implement |
|---------|-------------|-----------|
| Stack | Hierarchical navigation (Push/Pop) | `<Stack />` in `_layout.tsx` |
| Tabs | Bottom navigation bar | `<Tabs />` in `(tabs)/_layout.tsx` |
| Drawer | Side slide-out menu | `expo-router/drawer` |
| Modals | Overlay screens | `presentation: 'modal'` in Stack screen |

---

## Key Packages & Purpose

| Package | Purpose |
|---------|---------|
| expo-router | File-based routing (Next.js like) |
| nativewind | Use Tailwind CSS classes in React Native |
| react-native-reanimated | Smooth animations (runs on UI thread) |
| @tanstack/react-query | Server state management, caching, pre-fetching |
| zustand | Global state management (lighter than Redux) |
| expo-image | Optimized image rendering for performance |

---

## Setup Steps (2026 Standard)

1. Initialize Project:
   ```bash
   npx create-expo-app@latest my-app --template default
   cd my-app
   ```

2. Install Core Dependencies:
   ```bash
   npx expo install expo-router react-native-safe-area-context react-native-screens expo-link expo-constants expo-status-bar
   ```

3. Install NativeWind v4:
   ```bash
   npm install nativewind tailwindcss react-native-reanimated
   ```

4. Configure NativeWind (Babel & CSS):
   - Add plugin to `babel.config.js`: `plugins: ["nativewind/babel"]`.
   - Create `global.css` with: `@import "tailwindcss";`.
   - Import `global.css` in `app/_layout.tsx`.

5. Run Project:
   ```bash
   npx expo start -c
   # Press 'i' for iOS simulator or 'a' for Android emulator
   ```

---

## Best Practices (Updated)

- **New Architecture**: Ensure `newArchEnabled: true` in `app.json` to leverage TurboModules and Fabric Renderer.
- **Typed Routes**: Use Expo Router's "Typed Routes" feature for type-safe routing (e.g., `router.push('/path')`).
- **React 19**: Reduce usage of `useMemo` or `useCallback` thanks to React Compiler (if enabled).
- **Components**: Build UI primitives (Box, Text) with NativeWind className for reusability.
- **Assets**: Use `expo-image` instead of default `<Image />` for better caching and performance.
- **API**: Always wrap API calls with TanStack Query, avoid direct calls in `useEffect`.
