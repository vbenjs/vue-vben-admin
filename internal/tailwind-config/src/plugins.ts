import type { Config } from 'tailwindcss';

import plugin from 'tailwindcss/plugin';

const flexCenterStyles = {
  'align-items': 'center',
  display: 'flex',
  'justify-content': 'center',
};

const plugins = [
  plugin(({ addUtilities }) => {
    addUtilities({
      '.flex-center': flexCenterStyles,
      '.flex-col-center': {
        ...flexCenterStyles,
      },
    });
  }),
] as unknown as Config['plugins'][];

export { plugins };
