// #!/usr/bin/env node

const { runjs } = require('@ylz/script-node-utils');
const { successTip, errorTip } = require('../utils');

const { run } = runjs;

const createChangeLog = async () => {
  try {
    await run(
      `conventional-changelog -p --config ./node_modules/@ylz/script-code-lint/lib/log/index.js -i CHANGELOG.md -s  && git add ./CHANGELOG.md`,
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
