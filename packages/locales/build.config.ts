import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  clean: true,
  declaration: true,
  entries: [
    'src/index',
    'src/helper',
    {
      builder: 'mkdist',
      input: './src/langs',
      // loaders: ['postcss'],
      outDir: './dist/langs',
    },
  ],
});
