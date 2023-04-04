import { type UserConfig } from 'vite';

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
};

export { commonConfig };
