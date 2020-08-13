#!/usr/bin/env node

const pkg = require('../../package.json');
const runjs = require('runjs');
const fs = require('fs-extra');
const resolve = require('../getCwdPath');
const { inquirerPrompt, successTip, errorTip } = require('../utils');
const shell = require('shelljs');

const { run } = runjs;
const { writeFileSync } = fs;

const MAJOR = 1;
const FEAT = 2;
const FIX = 3;
const SKIP = 4;
const updateVersion = async (msg = 'Please select this update to submit changes') => {
  try {
    const prompt = inquirerPrompt({
      type: 'list',
      message: msg,
      name: 'type',
      choices: [
        {
          name: 'Some other features (such as bug fixes, style adjustments)',
          value: FIX,
        },
        {
          name: 'New features added',
          value: FEAT,
        },
        {
          name: 'Major version changes',
          value: MAJOR,
        },
        {
          name: 'jump over',
          value: SKIP,
        },
      ],
    });
    const { type } = await prompt;

    const versionString = pkg.version.split('.');

    const versionNumber = versionString.map((vs) => Number(vs));
    if (type !== SKIP) {
      if (type === MAJOR) {
        versionNumber[0]++;
        versionNumber[1] = 0;
        versionNumber[2] = 0;
      } else if (type === FEAT) {
        versionNumber[1]++;
        versionNumber[2] = 0;
      } else {
        versionNumber[2]++;
      }

      pkg.version = versionNumber.join('.');

      writeFileSync(resolve('package.json'), JSON.stringify(pkg, null, 2), {
        encoding: 'utf8',
      });
    }

    if (shell.which('git')) {
      await run(` git add ./package.json `, {
        async: true,
        stdio: 'inherit',
      });
    }

    successTip(
      `The version number has been updated successfully! The current version is ${pkg.version}!`
    );
  } catch (err) {
    errorTip('Version number update failed\n' + err);
  }
};

module.exports = {
  updateVersion,
};
