import path from 'node:path';

import { $ } from 'zx';

export * from '@changesets/git';

/**
 * 获取暂存区文件
 */
async function getStagedFiles() {
  try {
    $.verbose = false;
    const { stdout: lines } =
      await $`git -c submodule.recurse=false diff --staged --diff-filter=ACMR --name-only --ignore-submodules -z`;

    let changedList = lines ? lines.replace(/\0$/, '').split('\0') : [];
    changedList = changedList.map((item) => path.resolve(process.cwd(), item));
    const changedSet = new Set(changedList);
    changedSet.delete('');
    return [...changedSet];
  } catch {
    return [];
  }
}

export { getStagedFiles };
