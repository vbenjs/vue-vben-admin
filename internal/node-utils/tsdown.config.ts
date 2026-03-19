import { defineConfig } from 'tsdown';

export default defineConfig({
  clean: false,
  deps: {
    skipNodeModulesBundle: true,
  },
  entry: ['src/index.ts'],
  format: ['esm'],
});
