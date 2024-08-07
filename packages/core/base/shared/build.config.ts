import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  clean: true,
  declaration: true,
  entries: [
    'src/index',
    'src/constants/index',
    'src/utils/index',
    'src/colorful/index',
    'src/cache/index',
  ],
});
