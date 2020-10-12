import { exec, which } from 'shelljs';

function ignoreCaseGit() {
  try {
    if (which('git').code === 0) {
      exec('git config core.ignorecase false ');
    }
  } catch (error) {
    console.log(error);
  }
}

export function runPostInstall() {
  ignoreCaseGit();
}
