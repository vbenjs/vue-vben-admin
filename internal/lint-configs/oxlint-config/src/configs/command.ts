import type { OxlintConfig } from 'oxlint';

const command: OxlintConfig = {
  jsPlugins: [
    {
      name: 'command',
      specifier: 'eslint-plugin-command',
    },
  ],
  rules: {
    'command/command': 'error',
  },
};

export { command };
