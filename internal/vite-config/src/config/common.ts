import { presetTypography, presetUno } from 'unocss';
import UnoCSS from 'unocss/vite';
import { type UserConfig } from 'vite';

const commonConfig: UserConfig = {
  server: {
    host: true,
  },

  build: {
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1500,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@vben/design/shared";`,
      },
    },
  },
  plugins: [
    UnoCSS({
      exclude: [
        'node_modules',
        'dist',
        '.git',
        '.husky',
        '.vscode',
        '.config',
        '.changeset',
        'public',
      ],
      presets: [presetUno(), presetTypography()],
    }),
  ],
};

export { commonConfig };
