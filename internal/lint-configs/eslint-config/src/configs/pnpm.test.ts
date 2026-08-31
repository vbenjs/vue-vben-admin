import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';

import { jsonc } from './jsonc';
import { pnpm } from './pnpm';

describe('pnpm eslint config', () => {
  it('reports invalid catalog entries without applying autofixes', async () => {
    const [packageJsonConfig] = await pnpm();

    expect(packageJsonConfig?.rules?.['pnpm/json-valid-catalog']).toEqual([
      'error',
      { autofix: false },
    ]);
  });

  it('does not change an invalid catalog during an ESLint autofix run', async () => {
    const fixtureDirectory = await mkdtemp(
      join(tmpdir(), 'vben-pnpm-catalog-'),
    );
    const packageJsonPath = join(fixtureDirectory, 'package.json');
    const workspacePath = join(fixtureDirectory, 'pnpm-workspace.yaml');
    const packageJson = `${JSON.stringify(
      {
        name: 'catalog-fixture',
        private: true,
        dependencies: {
          'missing-catalog-package': 'catalog:missing',
        },
      },
      null,
    )}\n`;
    const workspace = 'packages: []\ncatalog:\n  existing-package: ^1.0.0\n';

    try {
      await writeFile(packageJsonPath, packageJson);
      await writeFile(workspacePath, workspace);

      const eslint = new ESLint({
        cwd: fixtureDirectory,
        fix: true,
        overrideConfig: [...(await jsonc()), ...(await pnpm())],
        overrideConfigFile: true,
      });
      const [result] = await eslint.lintFiles(['package.json']);

      expect(result?.messages).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            ruleId: 'pnpm/json-valid-catalog',
          }),
        ]),
      );
      expect(result?.output).toBeUndefined();

      // The rule queues workspace writes asynchronously when autofixes are enabled.
      await new Promise((resolve) => setTimeout(resolve, 1100));
      await expect(readFile(packageJsonPath, 'utf8')).resolves.toBe(
        packageJson,
      );
      await expect(readFile(workspacePath, 'utf8')).resolves.toBe(workspace);
    } finally {
      await rm(fixtureDirectory, { force: true, recursive: true });
    }
  });
});
