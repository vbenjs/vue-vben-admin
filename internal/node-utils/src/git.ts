import path from 'node:path';

import { execa } from 'execa';

export * from '@changesets/git';

/**
 * 获取暂存区文件
 */
async function getStagedFiles(): Promise<string[]> {
  try {
    const { stdout } = await execa('git', [
      '-c',
      'submodule.recurse=false',
      'diff',
      '--staged',
      '--diff-filter=ACMR',
      '--name-only',
      '--ignore-submodules',
      '-z',
    ]);

    const nullSeparator = '\u0000';
    const normalizedStdout = stdout.endsWith(nullSeparator)
      ? stdout.slice(0, -1)
      : stdout;
    let changedList = normalizedStdout
      ? normalizedStdout.split(nullSeparator)
      : [];
    changedList = changedList.map((item) => path.resolve(process.cwd(), item));
    const changedSet = new Set(changedList);
    changedSet.delete('');
    return [...changedSet];
  } catch (error) {
    console.error('Failed to get staged files:', error);
    return [];
  }
}

export { getStagedFiles };
