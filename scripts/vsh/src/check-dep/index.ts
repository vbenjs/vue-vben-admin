import type { CAC } from 'cac';

import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

import { execa } from '@vben/node-utils';

const require = createRequire(import.meta.url);
const knipMain = require.resolve('knip');
const knipCli = join(dirname(knipMain), '..', 'bin', 'knip.js');

const DEFAULT_CONFIG = {
  ignore: ['dist/**', 'docs/**', 'node_modules/**', 'public/**'],
  ignoreBinaries: [] as string[],
  ignoreDependencies: [
    '@iconify/json',
    '@vben-core/design',
    '@vben/commitlint-config',
    '@vben/eslint-config',
    '@vben/stylelint-config',
    '@vben/tailwind-config',
    '@vben/vite-config',
    '@vben/oxlint-config',
    'playwright',
    'rimraf',
    'tailwindcss',
  ],
  ignoreWorkspaces: ['internal/lint-configs/*', 'scripts/*'],
};

interface KnipDependency {
  col: number;
  line: number;
  name: string;
  pos: number;
}

interface KnipFileIssue {
  dependencies: KnipDependency[];
  devDependencies: KnipDependency[];
  file: string;
  optionalPeerDependencies: KnipDependency[];
}

interface KnipResult {
  issues: KnipFileIssue[];
}

/**
 * 格式化依赖检查结果
 * @param result - 依赖检查结果
 */
function formatResult(result: KnipResult): void {
  let hasIssues = false;

  for (const issue of result.issues) {
    const hasDeps = issue.dependencies.length > 0;
    const hasDevDeps = issue.devDependencies.length > 0;

    if (!hasDeps && !hasDevDeps) {
      continue;
    }

    hasIssues = true;
    console.log(`\n📦 ${issue.file}`);

    if (hasDeps) {
      console.log('⚠️ Unused dependencies:');
      for (const dep of issue.dependencies) {
        console.log(`  - ${dep.name}`);
      }
    }

    if (hasDevDeps) {
      console.log('⚠️ Unused devDependencies:');
      for (const dep of issue.devDependencies) {
        console.log(`  - ${dep.name}`);
      }
    }
  }

  if (!hasIssues) {
    console.log('\n✅ Dependency check completed, no issues found');
  }
}

/**
 * 运行依赖检查
 */
async function runKnipCheck(): Promise<void> {
  const cwd = process.cwd();
  const tempDir = await mkdtemp(join(tmpdir(), 'vsh-check-dep-'));
  const configFile = join(tempDir, 'knip.json');

  try {
    await writeFile(configFile, JSON.stringify(DEFAULT_CONFIG));

    const args = [
      knipCli,
      '--config',
      configFile,
      '--include',
      'dependencies',
      '--reporter',
      'json',
      '--no-config-hints',
    ];

    await execa(process.execPath, args, { cwd });
    console.log('\n✅ Dependency check completed, no issues found');
  } catch (error: unknown) {
    const execaError = error as {
      exitCode?: number;
      stdout?: string;
    };

    if (execaError.exitCode === 1 && execaError.stdout) {
      const result: KnipResult = JSON.parse(execaError.stdout);
      formatResult(result);
      return;
    }

    console.error(
      '❌ Dependency check failed:',
      error instanceof Error ? error.message : error,
    );
  } finally {
    await rm(tempDir, { force: true, recursive: true });
  }
}

/**
 * 定义依赖检查命令
 * @param cac - CAC实例
 */
function defineCheckDepCommand(cac: CAC): void {
  cac
    .command('check-dep')
    .usage('Analyze project dependencies using knip')
    .action(async () => {
      await runKnipCheck();
    });
}

export { defineCheckDepCommand };
