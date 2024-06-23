import type { Config } from 'tailwindcss';

import path from 'node:path';

import { fs, getPackagesSync } from '@vben/node-utils';

import { addDynamicIconSelectors } from '@iconify/tailwind';
import formsPlugin from '@tailwindcss/forms';
import typographyPlugin from '@tailwindcss/typography';
import animate from 'tailwindcss-animate';

import { enterAnimationPlugin } from './plugins/entry';

// import defaultTheme from 'tailwindcss/defaultTheme';

const { packages } = getPackagesSync();

const tailwindPackages: string[] = [];

packages.forEach((pkg) => {
  // apps目录下和 @vben-core/tailwind-ui 包需要使用到 tailwindcss ui
  if (fs.existsSync(path.join(pkg.dir, 'tailwind.config.mjs'))) {
    tailwindPackages.push(pkg.dir);
  }
});

function createColorsPattern(name: string) {
  return {
    100: `hsl(var(--${name}-100))`,
    200: `hsl(var(--${name}-200))`,
    300: `hsl(var(--${name}-300))`,
    400: `hsl(var(--${name}-400))`,
    500: `hsl(var(--${name}-500))`,
    600: `hsl(var(--${name}-600))`,
    700: `hsl(var(--${name}-700))`,
    800: `hsl(var(--${name}-800))`,
    900: `hsl(var(--${name}-900))`,
    1000: `hsl(var(--${name}-1000))`,
    active: `hsl(var(--${name}-700))`,
    background: `hsl(var(--${name}-100))`,
    'background-hover': `hsl(var(--${name}-200))`,
    border: `hsl(var(--${name}-300))`,
    'border-hover': `hsl(var(--${name}-400))`,
    foreground: `hsl(var(--${name}-foreground))`,
    hover: `hsl(var(--${name}-500))`,
    text: `hsl(var(--${name}-900))`,
    'text-active': `hsl(var(--${name}-1000))`,
    'text-hover': `hsl(var(--${name}-800))`,
  };
}

export default {
  content: [
    './index.html',
    ...tailwindPackages.map((item) =>
      path.join(item, 'src/**/*.{vue,js,ts,jsx,tsx,svelte,astro,html}'),
    ),
  ],
  darkMode: 'class',
  plugins: [
    animate,
    formsPlugin,
    typographyPlugin,
    addDynamicIconSelectors(),
    enterAnimationPlugin,
  ],
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
      animationDuration: {
        '2000': '2000ms',
        '3000': '3000ms',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: 'calc(var(--radius) + 4px)',
      },
      colors: {
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
          hover: 'hsl(var(--accent-hover))',
        },
        authentication: 'hsl(var(--authentication))',
        background: 'hsl(var(--background))',
        border: 'hsl(var(--border))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        destructive: {
          ...createColorsPattern('destructive'),
          DEFAULT: 'hsl(var(--destructive))',
        },

        foreground: 'hsl(var(--foreground))',
        green: {
          ...createColorsPattern('green'),
          foreground: 'hsl(var(--success-foreground))',
        },
        heavy: {
          DEFAULT: 'hsl(var(--heavy))',
          foreground: 'hsl(var(--heavy-foreground))',
        },
        input: {
          DEFAULT: 'hsl(var(--input))',
          background: 'hsl(var(--input-background))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        overlay: 'hsl(var(--overlay))',
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          ...createColorsPattern('primary'),
          DEFAULT: 'hsl(var(--primary))',
        },
        red: {
          ...createColorsPattern('red'),
          foreground: 'hsl(var(--destructive-foreground))',
        },
        ring: 'hsl(var(--ring))',
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          desc: 'hsl(var(--secondary-desc))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        success: {
          ...createColorsPattern('success'),
          DEFAULT: 'hsl(var(--success))',
        },
        warning: {
          ...createColorsPattern('warning'),
          DEFAULT: 'hsl(var(--warning))',
        },
        yellow: {
          ...createColorsPattern('yellow'),
          foreground: 'hsl(var(--warning-foreground))',
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
