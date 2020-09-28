import { exec, which } from 'shelljs';

function ignoreCaseGit() {
  try {
    if (which('git')) {
      exec('git config core.ignorecase false ');
    }
  } catch (error) {}
}
ignoreCaseGit();
