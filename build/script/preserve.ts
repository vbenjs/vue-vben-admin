// Do you need to update the dependencies to prevent package.json from updating the dependencies, and no install after others get the code

import path from 'path';
import fs from 'fs-extra';
import { isEqual } from 'lodash';
import { sh } from 'tasksfile';
import { successConsole, errorConsole } from '../utils';

const resolve = (dir: string) => {
  return path.resolve(process.cwd(), dir);
};

const reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;

let NEED_INSTALL = false;

export async function runPreserve() {
  // rc.6 fixed
  const cwdPath = process.cwd();
  if (reg.test(cwdPath)) {
    errorConsole(
      'Do not include Chinese, Japanese or Korean in the full path of the project directory, please modify the directory name and run again!'
    );
    errorConsole('项目目录全路径请勿包含中文、日文、韩文,请修改目录名后再次重新运行!');
    process.exit(1);
  }

  await fs.mkdirp(resolve('build/.cache'));
  function checkPkgUpdate() {
    const pkg = require('../../package.json');
    const { dependencies, devDependencies } = pkg;
    const depsFile = resolve('build/.cache/deps.json');
    if (!fs.pathExistsSync(depsFile)) {
      NEED_INSTALL = true;
      return;
    }
    const depsJson = require('../.cache/deps.json');

    if (!isEqual(depsJson, { dependencies, devDependencies })) {
      NEED_INSTALL = true;
    }
  }
  checkPkgUpdate();
  if (NEED_INSTALL) {
    // no error
    successConsole(
      'A dependency change is detected, and the dependency is being installed to ensure that the dependency is consistent! (Tip: The project will be executed for the first time)！'
    );
    try {
      await sh('npm run bootstrap ', {
        async: true,
        nopipe: true,
      });

      successConsole('Dependency installation is successful, start running the project！');

      const pkg = require('../../package.json');
      const { dependencies, devDependencies } = pkg;
      const depsFile = resolve('build/.cache/deps.json');
      const deps = { dependencies, devDependencies };
      if (!fs.pathExistsSync(depsFile)) {
        fs.writeFileSync(depsFile, JSON.stringify(deps));
      } else {
        const depsFile = resolve('build/.cache/deps.json');
        const depsJson = require('../.cache/deps.json');
        if (!isEqual(depsJson, deps)) {
          fs.writeFileSync(depsFile, JSON.stringify(deps));
        }
      }
    } catch (error) {}
  }
}

runPreserve();
