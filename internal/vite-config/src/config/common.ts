import { type UserConfig } from 'vite';
import UnoCSS from 'unocss/vite';
import { presetTypography, presetUno } from 'unocss';

const commonConfig: UserConfig = {
  server: {
    host: true,
  },
  esbuild: {
    drop: ['console', 'debugger'],
  },
  build: {
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      // TODO: Prevent memory overflow
      maxParallelFileOps: 3,
    },
  },
  plugins: [
    UnoCSS({
      presets: [presetUno(), presetTypography()],
    }),
  ],
};

export { commonConfig };
