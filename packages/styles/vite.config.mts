import { defineConfig } from '@vben/vite-config';

export default defineConfig({
  vite: {
    build: {
      lib: {
        entry: {
          antd: 'src/antd/index.ts',
          index: 'src/index.ts',
        },
        fileName: (_format, name) => `${name}.mjs`,
      },
    },
    publicDir: 'src/bem',
  },
});
