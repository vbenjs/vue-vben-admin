# Repository Guidelines

## Project Structure & Module Organization

- `apps/web-antd/`: main Vue 3 SPA and entry point; `src/bootstrap.ts` wires modules and global providers; static assets stay in `public/`.
- `apps/backend-mock/`: mock API server for local development; keep fixtures under `mock/` aligned with backend contracts.
- `packages/*`: reusable TypeScript libraries (`stores`, `utils`, `styles`, etc.) with colocated unit tests in `__tests__/`.
- `internal/`: Node-based build and tooling helpers (for example `internal/node-utils`).
- `docs/` and `playground/`: documentation site and Playwright scenarios; update examples when component APIs change.

## Build, Test, and Development Commands

- `pnpm install`: installs workspace dependencies (requires Node ≥20.10 and pnpm ≥9.12) and runs package stubs.
- `pnpm dev`: starts active apps through Turbo; use `pnpm -F @vben/web-antd run dev` for the UI only.
- `pnpm build`: produces production bundles for apps and packages; `pnpm build:docs` and `pnpm build:play` target docs and playground respectively.
- `pnpm check`: runs circular dependency, dependency graph, type, and spelling checks before release.

## Coding Style & Naming Conventions

- Respect shared configs in `eslint.config.mjs`, `@vben/prettier-config`, and `stylelint.config.mjs`; format staged changes with `pnpm format`.
- Default to 2-space indentation, strict TypeScript, and `<script setup>` SFCs.
- Name Vue components `PascalCase.vue`, composables `useThing.ts`, utilities `camelCase.ts`, and routes/views with kebab-case filenames under `src/router` and `src/views`.

## Testing Guidelines

- Colocate unit tests inside `__tests__` folders (for example `packages/utils/src/helpers/__tests__/generate-menus.test.ts`); use the `*.test.ts` suffix.
- Run `pnpm test:unit` for Vitest (happy-dom environment) and keep new logic backed by deterministic assertions.
- Place end-to-end Playwright specs in `playground/__tests__/e2e/*.spec.ts`; execute them via `pnpm test:e2e` and attach screenshots for UI changes when helpful.

## Commit & Pull Request Guidelines

- Adopt Conventional Commits (`feat:`, `fix:`, `chore:`), matching history such as `fix: watermark create error #6788`; run `pnpm commit` to launch the Commitizen (`czg`) flow.
- Let Lefthook manage staged formatting and linting; resolve issues before pushing.
- Pull requests must outline scope, link issues, list verification steps (`pnpm test:unit`, `pnpm test:e2e`), and call out any config, API, or UI breakage.
