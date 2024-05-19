import type { Config } from 'tailwindcss';

import path from 'node:path';

import { addDynamicIconSelectors } from '@iconify/tailwind';
import formsPlugin from '@tailwindcss/forms';
import { fs, getPackagesSync } from '@vben/node-utils';
import animate from 'tailwindcss-animate';
// import defaultTheme from 'tailwindcss/defaultTheme';

const { packages } = getPackagesSync();

const tailwindPackages: string[] = [];

packages.forEach((pkg) => {
  // apps目录下和 @vben-core/tailwind-ui 包需要使用到 tailwindcss ui
  if (fs.existsSync(path.join(pkg.dir, 'tailwind.config.mjs'))) {
    tailwindPackages.push(pkg.dir);
  }
});

export default {
  content: [
    './index.html',
    ...tailwindPackages.map((item) =>
      path.join(item, 'src/**/*.{vue,js,ts,jsx,tsx,svelte,astro,html}'),
    ),
  ],
  darkMode: 'class',
  plugins: [animate, formsPlugin, addDynamicIconSelectors()],
  prefix: '',
  safelist: ['dark'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'collapsible-down': 'collapsible-down 0.2s ease-in-out',
        'collapsible-up': 'collapsible-up 0.2s ease-in-out',
        float: 'float 5s linear 0ms infinite',
      },
      borderRadius: {
        lg: 'var(--radius-base)',
        md: 'calc(var(--radius-base) - 2px)',
        sm: 'calc(var(--radius-base) - 4px)',
        xl: 'calc(var(--radius-base) + 4px)',
      },
      colors: {
        accent: {
          DEFAULT: 'hsl(var(--color-accent))',
          foreground: 'hsl(var(--color-accent-foreground))',
          hover: 'hsl(var(--color-accent-hover))',
        },
        background: 'hsl(var(--color-background) / <alpha-value>)',
        body: 'hsl(var(--color-body) / <alpha-value>)',
        border: 'hsl(var(--color-border))',
        card: {
          DEFAULT: 'hsl(var(--color-card))',
          foreground: 'hsl(var(--color-card-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--color-destructive))',
          foreground: 'hsl(var(--color-destructive-foreground))',
        },
        foreground: 'hsl(var(--color-foreground) / <alpha-value>)',
        heavy: {
          DEFAULT: 'hsl(var(--color-heavy) / <alpha-value>)',
          foreground: 'hsl(var(--color-heavy-foreground) / <alpha-value>)',
        },
        input: {
          DEFAULT: 'hsl(var(--color-input))',
          background: 'hsl(var(--color-input-background))',
        },
        muted: {
          DEFAULT: 'hsl(var(--color-muted))',
          foreground: 'hsl(var(--color-muted-foreground))',
        },
        overlay: 'hsl(var(--color-overlay))',
        popover: {
          DEFAULT: 'hsl(var(--color-popover))',
          foreground: 'hsl(var(--color-popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--color-primary) / <alpha-value>)',
          foreground: 'hsl(var(--color-primary-foreground) / <alpha-value>)',
        },
        ring: 'hsl(var(--color-ring))',
        secondary: {
          DEFAULT: 'hsl(var(--color-secondary) / <alpha-value>)',
          desc: 'hsl(var(--color-secondary-desc) / <alpha-value>)',
          foreground: 'hsl(var(--color-secondary-foreground) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: [
          'var(--font-geist-sans)',
          //  ...defaultTheme.fontFamily.sans
        ],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'collapsible-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-collapsible-content-height)' },
        },
        'collapsible-up': {
          from: { height: 'var(--radix-collapsible-content-height)' },
          to: { height: '0' },
        },
        float: {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      zIndex: {
        '100': '100',
        '1000': '1000',
      },
    },
  },
} as Config;
