# Tailwind CSS

[Tailwind CSS](https://tailwindcss.com/) is a utility-first CSS framework for quickly building custom designs. The current project uses **Tailwind CSS v4**.

## Configuration

The project no longer maintains Tailwind through `tailwind.config.*` files. Theme definitions and scan scope are now managed through CSS and the shared Vite configuration.

- Theme entry: `internal/tailwind-config/src/theme.css`
- Vite integration: `internal/vite-config`

In `global.css`, you will see the Tailwind CSS v4 directives currently used by the project, such as:

- `@source`
- `@custom-variant`
- `@theme`
- `@theme inline`
- `@utility`

## How Packages Use Tailwind CSS

The project does not decide whether Tailwind CSS is enabled based on whether a package contains `tailwind.config.mjs`.

Apps and packages share `@vben/vite-config`, which integrates `@tailwindcss/vite`. The Tailwind scan scope is managed centrally in `@vben/tailwind-config`, backed by `internal/tailwind-config/src/theme.css`.

::: tip Notes on using Tailwind CSS in packages

If you are building a pure SDK package and do not need Tailwind CSS, you do not need to add any legacy `tailwind.config.*` file.

:::

## `@apply` in Vue SFCs

The project applies a shared handling layer for `@apply` inside Vue single-file components. The related logic is located at:

- `internal/vite-config/src/plugins/tailwind-reference.ts`

When component styles use `@apply`, `@reference "@vben/tailwind-config/theme"` is injected automatically in most cases.
