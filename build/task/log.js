// #!/usr/bin/env node

const runjs = require('runjs');
const { successTip, errorTip } = require('../utils');
const shell = require('shelljs');

const { run } = runjs;

const createChangeLog = async () => {
  try {
    let cmd = `conventional-changelog -p custom-config -i CHANGELOG.md -s -r 0 `;
    if (shell.which('git')) {
      cmd += '&& git add CHANGELOG.md';
    }
    await run(cmd, {
      async: true,
      stdio: 'inherit',
    });
    await run('prettier --write **/CHANGELOG.md ', {
      async: true,
      stdio: 'inherit',
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
