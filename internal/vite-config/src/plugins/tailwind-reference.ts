import type { Plugin } from 'vite';

const REFERENCE_LINE = '@reference "@vben/tailwind-config/theme";\n';

/**
 * Auto-inject @reference into Vue SFC <style> blocks that use @apply.
 *
 * In Tailwind CSS v4, each Vue SFC <style scoped> block is processed as an
 * independent CSS module. If a style block uses @apply with custom theme
 * utilities (e.g. bg-primary, text-foreground), it needs access to the
 * @theme definition via @reference. This plugin auto-injects it so
 * individual components don't need to add it manually.
 */
export function viteTailwindReferencePlugin(): Plugin {
  return {
    enforce: 'pre',
    name: 'vite:tailwind-reference',
    transform(code, id) {
      // Only process Vue SFC style blocks
      if (!id.includes('.vue')) {
        return null;
      }
      if (!id.includes('type=style')) {
        return null;
      }
      // Skip if already has @reference
      if (code.includes('@reference')) {
        return null;
      }
      // Only inject if the style block uses @apply
      if (!code.includes('@apply')) {
        return null;
      }
      return {
        code: REFERENCE_LINE + code,
        map: null,
      };
    },
  };
}
