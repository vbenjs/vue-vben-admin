# Tailwind CSS v4 Migration Notes

## Current Status

The Tailwind CSS has been successfully upgraded from v3.4.18 to v4.1.17, but the build is not yet functional due to architectural changes in v4.

## Changes Completed

1. **Dependencies Updated:**
   - `tailwindcss`: ^3.4.17 → ^4.0.0 (v4.1.17 installed)
   - `@tailwindcss/nesting`: Removed (now built-in to v4)
   - `@tailwindcss/postcss`: Added (required for v4)
   - PostCSS configuration updated to use `@tailwindcss/postcss` plugin

2. **Configuration Updates:**
   - Updated `pnpm-workspace.yaml` catalog
   - Updated `internal/tailwind-config/package.json`
   - Removed `@tailwindcss/nesting` dependency (built-in to v4)
   - Updated peer dependency to `>=4.0.0-alpha`

3. **CSS Import Migration:**
   - Updated from `@tailwind` directives to `@import "tailwindcss"` (v4 style)
   - Note: Later reverted to `@tailwind` directives due to compatibility issues

## Critical Issues Discovered

### 1. JavaScript Configuration Not Fully Supported

Tailwind CSS v4 has a **CSS-first architecture**. The traditional JavaScript configuration (`tailwind.config.js`) is not processed the same way as in v3:

- Custom colors defined in `theme.extend.colors` don't automatically generate utility classes
- The `@tailwindcss/postcss` plugin doesn't accept a `config` parameter like v3's plugin did
- Config files are discovered automatically but utilities aren't generated from complex theme extensions

### 2. Custom Utility Classes Issue

The project extensively uses custom utilities based on CSS variables:
- `border-border`, `text-foreground`, `bg-background`
- `text-primary-hover`, `text-primary-active`
- Many color utilities with opacity modifiers

In v3, these were automatically generated from:
```javascript
colors: {
  border: {
    DEFAULT: 'hsl(var(--border))',
  },
  primary: {
    hover: 'hsl(var(--primary-600))',
    // ...
  }
}
```

In v4, this pattern doesn't work the same way. Utilities are not auto-generated from such theme configurations.

### 3. @apply Directive Limitations

The project uses `@apply` extensively with custom utilities:
```css
@apply border-border text-foreground bg-background;
@apply hover:text-primary-hover active:text-primary-active;
```

In v4, `@apply` with custom theme-based utilities requires those utilities to exist first, which they don't when using CSS variables in the theme config.

## Solutions & Next Steps

### Option 1: Use @theme Directive (Recommended for v4)

Define colors directly in CSS using the `@theme` directive:

```css
@import "tailwindcss";

@theme {
  --color-border*: hsl(var(--border));
  --color-foreground*: hsl(var(--foreground));
  --color-primary*: hsl(var(--primary));
  --color-primary-hover*: hsl(var(--primary-600));
  /* ... all other colors */
}
```

This makes colors available as `border`, `foreground`, `primary`, `primary-hover`, etc.

**Challenges:**
- Need to map all 50+ custom color definitions
- Need to ensure CSS variable references work correctly
- May conflict with existing CSS variable naming

### Option 2: Manual Utility Generation

Create utilities manually using CSS or plugins:

```css
@layer utilities {
  .border-border { border-color: hsl(var(--border)); }
  .text-primary-hover { color: hsl(var(--primary-600)); }
  /* ...hundreds of utilities */
}
```

**Challenges:**
- Extremely tedious for all combinations (colors × properties × modifiers)
- Hard to maintain
- Loses automatic responsive/hover/dark mode variants

### Option 3: Replace @apply with Raw CSS

Convert all `@apply` usage to regular CSS properties:

```css
/* Before */
.element {
  @apply border-border text-foreground;
}

/* After */
.element {
  border-color: hsl(var(--border));
  color: hsl(var(--foreground));
}
```

**Challenges:**
- Affects hundreds of files
- Loses Tailwind utility benefits
- More verbose code

### Option 4: Hybrid Approach

1. Define core theme colors using `@theme` directive
2. Keep JavaScript config for complex configurations (breakpoints, etc.)
3. Convert critical @apply usage to raw CSS where needed
4. Create manual utilities for frequently used custom combinations

### Option 5: Wait for Better v4 Support

Tailwind v4 is still relatively new. Future updates may:
- Improve JavaScript config support
- Add compatibility layers
- Provide migration tools

## Immediate Recommendations

1. **For Production:** Stay on Tailwind v3 until v4 matures or a clear migration path exists
2. **For Migration:** Allocate 2-3 days for a proper migration using Option 4 (Hybrid)
3. **Documentation:** Review official Tailwind v4 migration guide when available

## Files Affected

### Modified:
- `pnpm-workspace.yaml` - Updated catalog versions
- `pnpm-lock.yaml` - Dependencies updated
- `internal/tailwind-config/package.json` - Removed nesting, added postcss plugin
- `internal/tailwind-config/src/postcss.config.ts` - Updated PostCSS plugin
- `packages/@core/base/design/src/css/global.css` - Updated imports, partial @apply conversion
- `packages/styles/src/antd/index.css` - Attempted opacity modifier fix

### Needs Attention:
- All files using `@apply` with custom utilities
- Component styles relying on custom color utilities
- Theme configuration in `internal/tailwind-config/src/index.ts`

## Resources

- [Tailwind CSS v4 Documentation](https://tailwindcss.com)
- [v4 Beta Announcement](https://tailwindcss.com/blog/tailwindcss-v4-beta)
- [@tailwindcss/postcss Documentation](https://github.com/tailwindlabs/tailwindcss/tree/next/packages/%40tailwindcss-postcss)

## Testing Command

```bash
pnpm run build:antd
```

Currently fails with:
```
Cannot apply unknown utility class `rounded-sm`
```

This indicates the Tailwind configuration is not being loaded properly by the v4 PostCSS plugin.
