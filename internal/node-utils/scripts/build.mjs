import { spawnSync } from 'node:child_process';

const pnpmCommand =
  process.env.npm_execpath && process.env.npm_execpath.endsWith('.cjs')
    ? [process.execPath, process.env.npm_execpath]
    : ['pnpm'];

const steps = [
  ['exec', 'tsdown', '--no-dts'],
  [
    'exec',
    'tsc',
    '-p',
    'tsconfig.build.json',
    '--emitDeclarationOnly',
    '--declaration',
    '--outDir',
    'dist',
  ],
];

for (const args of steps) {
  const [command, ...commandArgs] = pnpmCommand;
  let cmd = command;
  if (cmd.includes(' ')) {
    cmd = `"${command}"`;
  }
  const result = spawnSync(cmd, [...commandArgs, ...args], {
    shell: true,
    stdio: 'inherit',
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
