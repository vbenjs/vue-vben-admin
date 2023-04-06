import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  clean: true,
  entries: ['src/index', 'src/strict'],
  declaration: true,
  rollup: {
    emitCJS: true,
  },
});
