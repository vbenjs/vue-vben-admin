import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  clean: true,
  declaration: true,
  entries: [
    {
      builder: 'mkdist',
      input: './src',
      loaders: ['sass'],
      outDir: './dist',
      pattern: ['index.scss'],
    },
    {
      builder: 'mkdist',
      input: './src',
      // loaders: ['postcss'],
      outDir: './dist',
      pattern: ['tailwind.css'],
    },
  ],
});
