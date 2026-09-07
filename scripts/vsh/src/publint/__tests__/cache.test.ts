import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { getPackageHash, readCache } from '../index';

const tempDirectories: string[] = [];

afterEach(async () => {
  for (const directory of tempDirectories.splice(0)) {
    await rm(directory, { force: true, recursive: true });
  }
});

describe('publint cache key', () => {
  it('recovers from an empty or malformed cache without throwing', async () => {
    const cachePath = join(process.cwd(), '.tmp-publint-cache.json');
    tempDirectories.push(cachePath);
    await writeFile(cachePath, '{malformed');

    await expect(readCache(cachePath)).resolves.toEqual({});
  });

  it('invalidates when a declared output file is created', async () => {
    const packageDir = join(process.cwd(), '.tmp-publint-cache-test');
    tempDirectories.push(packageDir);
    await mkdir(join(packageDir, 'dist'), { recursive: true });

    const packageJson = {
      exports: {
        '.': {
          default: './dist/index.mjs',
          types: './dist/index.d.ts',
        },
      },
      main: './dist/index.mjs',
    };

    const missingOutputHash = await getPackageHash(packageJson, packageDir);
    await writeFile(join(packageDir, 'dist/index.mjs'), 'export {}');
    const createdOutputHash = await getPackageHash(packageJson, packageDir);

    expect(createdOutputHash).not.toBe(missingOutputHash);
  });

  it('changes when a declared output file is modified', async () => {
    const packageDir = join(process.cwd(), '.tmp-publint-cache-test');
    tempDirectories.push(packageDir);
    await mkdir(join(packageDir, 'dist'), { recursive: true });
    const outputPath = join(packageDir, 'dist/index.mjs');
    await writeFile(outputPath, 'export const value = 1');

    const packageJson = { main: './dist/index.mjs' };
    const initialHash = await getPackageHash(packageJson, packageDir);
    await writeFile(outputPath, 'export const value = 100');
    const updatedHash = await getPackageHash(packageJson, packageDir);

    expect(updatedHash).not.toBe(initialHash);
  });

  it('invalidates when a wildcard output file is created', async () => {
    const packageDir = join(process.cwd(), '.tmp-publint-cache-test');
    tempDirectories.push(packageDir);
    await mkdir(join(packageDir, 'dist'), { recursive: true });

    const packageJson = {
      exports: {
        '.': './dist/*.mjs',
      },
    };

    const missingOutputHash = await getPackageHash(packageJson, packageDir);
    await writeFile(join(packageDir, 'dist/index.mjs'), 'export {}');
    const createdOutputHash = await getPackageHash(packageJson, packageDir);

    expect(createdOutputHash).not.toBe(missingOutputHash);
  });

  it('changes when a wildcard output file is modified', async () => {
    const packageDir = join(process.cwd(), '.tmp-publint-cache-test');
    tempDirectories.push(packageDir);
    await mkdir(join(packageDir, 'dist'), { recursive: true });
    const outputPath = join(packageDir, 'dist/index.mjs');
    await writeFile(outputPath, 'export const value = 1');

    const packageJson = { exports: { '.': './dist/*.mjs' } };
    const initialHash = await getPackageHash(packageJson, packageDir);
    await writeFile(outputPath, 'export const value = 100');
    const updatedHash = await getPackageHash(packageJson, packageDir);

    expect(updatedHash).not.toBe(initialHash);
  });
});
