import { defineConfig } from 'tsdown';

export default defineConfig({
  clean: true,
  deps: {
    skipNodeModulesBundle: true,
  },
  dts: {
    resolver: 'tsc',
  },
  entry: ['src/index.ts'],
  format: ['esm'],
  outExtensions: () => ({
    dts: '.d.ts',
  }),
});
