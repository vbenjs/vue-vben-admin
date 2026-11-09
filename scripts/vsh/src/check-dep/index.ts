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
  unlisted: KnipDependency[];
  unresolved: KnipDependency[];
}

interface KnipResult {
  issues: KnipFileIssue[];
}

/**
 * 格式化依赖检查结果
 * @param result - 依赖检查结果
 * @returns 发现的问题总数
 */
function formatResult(result: KnipResult): number {
  let issueCount = 0;

  for (const issue of result.issues) {
    const sections: [string, KnipDependency[]][] = [
      ['Unused dependencies', issue.dependencies],
      ['Unused devDependencies', issue.devDependencies],
      ['Unused optional peer dependencies', issue.optionalPeerDependencies],
      ['Unlisted dependencies', issue.unlisted],
      ['Unresolved imports', issue.unresolved],
    ];
    const printable = sections.filter(([, deps]) => deps.length > 0);

    if (printable.length === 0) {
      continue;
    }

    issueCount += printable.reduce((total, [, deps]) => total + deps.length, 0);
    console.log(`\n📦 ${issue.file}`);

    for (const [title, deps] of printable) {
      console.log(`⚠️ ${title}:`);
      for (const dep of deps) {
        console.log(`  - ${dep.name}`);
      }
    }
  }

  if (issueCount === 0) {
    console.log('\n✅ Dependency check completed, no issues found');
  }

  return issueCount;
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
      'dependencies,unlisted,unresolved',
      '--reporter',
      'json',
      '--no-config-hints',
    ];

    // knip 以退出码 1 表示发现 error 级问题,这里不因非零退出而抛错,
    // 统一解析 stdout 中的 JSON 报告。
    const result = await execa(process.execPath, args, { cwd, reject: false });

    if (result.exitCode !== 0 && result.exitCode !== 1) {
      console.error(
        '❌ Dependency check failed:',
        result.stderr || result.shortMessage || 'knip exited unexpectedly',
      );
      process.exitCode = 1;
      return;
    }

    let knipResult: KnipResult;
    try {
      knipResult = JSON.parse(result.stdout);
    } catch {
      console.error('❌ Dependency check failed: unable to parse knip output');
      process.exitCode = 1;
      return;
    }

    formatResult(knipResult);

    // 信任 knip 的失败判定:即使发现的问题不属于任何打印分节,
    // 命令也必须以非零退出,避免门禁漏判。
    if (result.exitCode === 1) {
      process.exitCode = 1;
    }
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

export { defineCheckDepCommand, formatResult, runKnipCheck };
