const { spawn } = require('node:child_process');

const DEFAULT_SUITES = ['workflow', 'finance', 'workflow-actions'];
const SUITE_COMMANDS = {
  finance: ['pnpm', 'run', 'test:smoke:riss:finance'],
  workflow: ['pnpm', 'run', 'test:smoke:riss:workflow'],
  'workflow-actions': ['pnpm', 'run', 'test:smoke:riss:workflow-actions'],
};

function parseArgs(argv) {
  const suitesArg = argv.find((item) => item.startsWith('--suites='));
  const retriesArg = argv.find((item) => item.startsWith('--retries='));

  const suites = suitesArg
    ? suitesArg
        .slice('--suites='.length)
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    : DEFAULT_SUITES;

  const retriesValue = retriesArg
    ? retriesArg.slice('--retries='.length)
    : process.env.RISS_SMOKE_RETRIES || '1';
  const retries = Number.parseInt(retriesValue, 10);

  return {
    retries: Number.isFinite(retries) && retries > 0 ? retries : 1,
    suites,
  };
}

function resolveCommand(command) {
  if (process.platform === 'win32' && !command.endsWith('.cmd')) {
    return `${command}.cmd`;
  }
  return command;
}

function runCommand(command, args) {
  return new Promise((resolve) => {
    const useShell = process.platform === 'win32';
    const resolvedCommand = resolveCommand(command);
    const child = useShell
      ? spawn([resolvedCommand, ...args].join(' '), {
          cwd: process.cwd(),
          env: process.env,
          shell: true,
          stdio: 'inherit',
        })
      : spawn(resolvedCommand, args, {
          cwd: process.cwd(),
          env: process.env,
          shell: false,
          stdio: 'inherit',
        });

    child.on('close', (code) => resolve(code ?? 1));
    child.on('error', () => resolve(1));
  });
}

async function runSuite(name, retries) {
  const command = SUITE_COMMANDS[name];
  if (!command) {
    throw new Error(`Unknown RISS smoke suite: ${name}`);
  }

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    console.log(`\n[RISS SMOKE] suite=${name} attempt=${attempt}/${retries}`);
    const exitCode = await runCommand(command[0], command.slice(1));
    if (exitCode === 0) {
      return { attempts: attempt, name, passed: true };
    }

    if (attempt < retries) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  return { attempts: retries, name, passed: false };
}

(async () => {
  const { retries, suites } = parseArgs(process.argv.slice(2));
  if (suites.length === 0) {
    throw new Error('No RISS smoke suites selected.');
  }

  const results = [];
  for (const suite of suites) {
    const result = await runSuite(suite, retries);
    results.push(result);
  }

  const failed = results.filter((item) => !item.passed);
  console.log('\n[RISS SMOKE] summary');
  for (const result of results) {
    console.log(
      `- ${result.name}: ${result.passed ? 'PASS' : 'FAIL'} (attempts=${result.attempts})`,
    );
  }

  if (failed.length > 0) {
    process.exit(1);
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
