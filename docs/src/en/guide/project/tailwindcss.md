# Tailwind CSS

[Tailwind CSS](https://tailwindcss.com/) is a utility-first CSS framework for quickly building custom designs. The current project uses **Tailwind CSS v4**.

## Browser Compatibility

Styles follow the [Tailwind CSS v4 browser requirements](https://tailwindcss.com/docs/compatibility): Chrome 111+, Safari 16.4+, and Firefox 128+. Other Chromium browsers need a corresponding engine version.

The project uses native CSS `@layer` to order component libraries, project components, and utilities. Browsers without `@layer` support ignore all styles inside those layers. Changing Vite `build.target` or disabling component library layers does not provide full compatibility. Supporting older browsers requires a separate compatibility build that handles layers across the complete CSS bundle, runtime component styles, and other modern CSS features.

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

## Custom Utilities and `cn()`

Custom utilities in this project (such as `flex-center`) are defined with the `@utility` syntax in `internal/tailwind-config/src/theme.css`.

**When adding a custom utility, register it exactly once in `customUtilityClassGroups` in `packages/@core/base/shared/src/utils/cn.ts`.** Compound utilities set multiple CSS properties and need separate groups. For example:

```ts
const customUtilityClassGroups = {
  'flex-center': ['flex-center'],
  'flex-col-center': ['flex-col-center'],
};
```

Also configure asymmetric conflicts in `extendTailwindMerge` through `conflictingClassGroups`: `flex-center` can remove preceding `display`, `align-items`, and `justify-content` classes; `flex-col-center` can additionally remove preceding `flex-direction` classes and `flex-center`. Pass `keyof typeof customUtilityClassGroups` as the generic argument to `extendTailwindMerge` to declare the additional group IDs.

Only configure a conflict that removes a preceding class when the current utility covers all of that class's properties:

```ts
cn('items-start', 'flex-center'); // 'flex-center'
cn('flex-center', 'items-start'); // 'flex-center items-start'
cn('flex-center', 'flex'); // 'flex-center flex'
cn('flex-col-center', 'flex-center'); // 'flex-col-center flex-center'
cn('flex-col-center', 'hidden md:flex'); // 'flex-col-center hidden md:flex'
```

A later atomic class overrides only its own property, while the compound class continues to provide the remaining properties. These centering utilities appear before the corresponding atomic utilities in the generated CSS, so `hidden` hides the element and `md:flex` restores it with its column direction and alignment intact. Different variants and `!important` markers follow tailwind-merge's separate conflict scopes.

::: warning Preserve the remaining properties of compound utilities

Do not add compound utilities directly to atomic groups such as `display`, or register the same class in multiple groups. tailwind-merge removes whole classes, so a partial conflict must not discard unrelated alignment or direction properties.

The guard test at `packages/@core/base/shared/src/utils/__tests__/cn.test.ts` checks that registrations are complete, valid, and unique.

:::

## `@apply` in Vue SFCs

The project applies a shared handling layer for `@apply` inside Vue single-file components. The related logic is located at:

- `internal/vite-config/src/plugins/tailwind-reference.ts`

When component styles use `@apply`, `@reference "@vben/tailwind-config/theme"` is injected automatically in most cases.
