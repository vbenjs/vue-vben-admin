// #!/usr/bin/env node

import { sh } from 'tasksfile';
import { errorConsole, successConsole } from '../utils';

export const runChangeLog = async () => {
  try {
    let cmd = `conventional-changelog -p custom-config -i CHANGELOG.md -s -r 0 `;

    await sh(cmd, {
      async: true,
      nopipe: true,
    });
    await sh('prettier --write **/CHANGELOG.md ', {
      async: true,
      nopipe: true,
    });
    successConsole('CHANGE_LOG.md generated successfully！');
  } catch (error) {
    errorConsole('CHANGE_LOG.md generated error\n' + error);

    process.exit(1);
  }
};

runChangeLog();
