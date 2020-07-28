// #!/usr/bin/env node

const runjs = require('runjs');
const { successTip, errorTip } = require('../utils');

const { run } = runjs;

const createChangeLog = async () => {
  try {
    await run(
      `conventional-changelog -p custom-config -i CHANGELOG.md -s -r 0&& git add CHANGELOG.md`,
      {
        async: true,
        stdio: 'inherit',
      }
    );
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
