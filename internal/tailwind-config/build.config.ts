import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  clean: true,
  declaration: true,
  entries: ['src/index', './src/postcss.config', './src/plugins/iconify'],
  rollup: {
    emitCJS: true,
  },
});
