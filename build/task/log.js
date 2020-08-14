// #!/usr/bin/env node

const { sh } = require('tasksfile');
const { successTip, errorTip } = require('../utils');

const createChangeLog = async () => {
  try {
    let cmd = `conventional-changelog -p custom-config -i CHANGELOG.md -s -r 0 `;
    // if (shell.which('git')) {
    //   cmd += '&& git add CHANGELOG.md';
    // }
    await sh(cmd, {
      async: true,
      nopipe: true,
    });

    await sh('prettier --write **/CHANGELOG.md ', {
      async: true,
      nopipe: true,
    });
    successTip('CHANGE_LOG generated successfully');
  } catch (error) {
    errorTip('CHANGE_LOG generated error\n' + error);
    process.exit(1);
  }
};
createChangeLog();
module.exports = {
  createChangeLog,
};
