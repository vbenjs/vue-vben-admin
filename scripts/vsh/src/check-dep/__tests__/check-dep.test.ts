import { execa } from '@vben/node-utils';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { formatResult, runKnipCheck } from '../index';

vi.mock('@vben/node-utils', () => ({ execa: vi.fn() }));

const mockedExeca = vi.mocked(execa);

function dependency(name: string) {
  return { col: 1, line: 2, name, pos: 0 };
}

afterEach(() => {
  vi.clearAllMocks();
  process.exitCode = undefined;
});

describe('formatResult', () => {
  it('reports zero issues and prints a success message', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const count = formatResult({ issues: [] });

    expect(count).toBe(0);
    expect(log).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenCalledWith(expect.stringContaining('✅'));
  });

  it('counts and prints every enabled category', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const count = formatResult({
      issues: [
        {
          dependencies: [dependency('left-pad')],
          devDependencies: [],
          file: 'package.json',
          optionalPeerDependencies: [],
          unlisted: [dependency('dayjs')],
          unresolved: [],
        },
        {
          dependencies: [],
          devDependencies: [dependency('oxlint')],
          file: 'packages/types/package.json',
          optionalPeerDependencies: [dependency('vite')],
          unresolved: [dependency('missing-module')],
          unlisted: [],
        },
      ],
    });

    expect(count).toBe(5);
    const lines = log.mock.calls.map(([line]) => line);
    expect(lines).toContain('⚠️ Unused dependencies:');
    expect(lines).toContain('⚠️ Unused devDependencies:');
    expect(lines).toContain('⚠️ Unused optional peer dependencies:');
    expect(lines).toContain('⚠️ Unlisted dependencies:');
    expect(lines).toContain('⚠️ Unresolved imports:');
    expect(lines).toContain('  - left-pad');
    expect(lines).toContain('  - dayjs');
    expect(lines).toContain('  - oxlint');
    expect(lines).toContain('  - vite');
    expect(lines).toContain('  - missing-module');
    expect(lines).not.toContainEqual(expect.stringContaining('✅'));
  });

  it('prints files whose only findings are optional peer dependencies', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const count = formatResult({
      issues: [
        {
          dependencies: [],
          devDependencies: [],
          file: 'package.json',
          optionalPeerDependencies: [dependency('peer-dep')],
          unlisted: [],
          unresolved: [],
        },
      ],
    });

    expect(count).toBe(1);
    const lines = log.mock.calls.map(([line]) => line);
    expect(lines).toContain('\n📦 package.json');
    expect(lines).toContain('⚠️ Unused optional peer dependencies:');
    expect(lines).toContain('  - peer-dep');
  });
});

describe('runKnipCheck', () => {
  it('exits 0 when knip reports a clean result', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockedExeca.mockResolvedValue({
      exitCode: 0,
      failed: false,
      stdout: '{"issues":[]}',
    } as never);

    await runKnipCheck();

    expect(process.exitCode).toBeUndefined();
  });

  it('exits 1 when knip exits 1 with findings', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockedExeca.mockResolvedValue({
      exitCode: 1,
      failed: false,
      stdout: JSON.stringify({
        issues: [
          {
            dependencies: [dependency('left-pad')],
            devDependencies: [],
            file: 'package.json',
            optionalPeerDependencies: [],
            unlisted: [],
            unresolved: [],
          },
        ],
      }),
    } as never);

    await runKnipCheck();

    expect(process.exitCode).toBe(1);
  });

  it('exits 1 even when knip exit 1 findings are not printable', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockedExeca.mockResolvedValue({
      exitCode: 1,
      failed: false,
      stdout: '{"issues":[]}',
    } as never);

    await runKnipCheck();

    expect(process.exitCode).toBe(1);
  });

  it('exits 1 when knip output cannot be parsed', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockedExeca.mockResolvedValue({
      exitCode: 1,
      failed: false,
      stdout: 'not json',
    } as never);

    await runKnipCheck();

    expect(process.exitCode).toBe(1);
    expect(error).toHaveBeenCalledWith(
      expect.stringContaining('unable to parse knip output'),
    );
  });

  it('exits 1 when knip fails to run', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockedExeca.mockResolvedValue({
      exitCode: 2,
      failed: true,
      shortMessage: 'Command failed',
      stderr: 'boom',
    } as never);

    await runKnipCheck();

    expect(process.exitCode).toBe(1);
    expect(error).toHaveBeenCalledWith('❌ Dependency check failed:', 'boom');
  });
});
