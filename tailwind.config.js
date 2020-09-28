// #4c5eb8
const { colors, inset } = require('tailwindcss/defaultTheme');

const themeColors = {
  mask: {
    light: 'rgba(255,255,255,0.3)',
  },
  primary: '#018ffb',
  success: '#55d187',
  warning: '#ffd164',
  danger: '#ed6f6f',
};

module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      './index.html',
      './src/**/*.vue',
      './src/**/*.js',
      './src/**/*.jsx',
      './src/**/*.ts',
      './src/**/*.tsx',
    ],
  },
  theme: {
    colors: {
      ...colors,
      ...themeColors,
    },
    inset: {
      ...inset,
      '1/2': '50%',
    },
    screens: {
      xs: '480px',
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      xxl: '1600px',
    },
    fontSize: {
      xs: '.75rem', // 12px
      sm: '.875rem', // 14px
      base: '1rem', // 16px
      lg: '1.125rem', // 18px
      xl: '1.25rem', // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem', // 48px
      '6xl': '4rem', // 64px
      logo: '9rem', // 134px
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
    fontFamily: {
      logo: [' Georgia', 'serif'],
    },
  },
  future: {
    // 2.0 remove col-gap-{n}
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
};
