import type { Package } from '@vben/node-utils';

import { join } from 'node:path';

import { $, fs, getPackages } from '@vben/node-utils';

import { cancel, isCancel, multiselect } from '@clack/prompts';

interface RunOptions {
  command?: string;
}

export async function run(options: RunOptions) {
  const { command } = options;
  const { packages } = await getPackages();
  const appPkgs = await findApps(process.cwd(), packages);

  const selectApps = await multiselect<any, string>({
    message: `Select the app you need to run [${command}]:`,
    options: appPkgs.map((item) => ({ label: item, value: item })),
    required: true,
  });

  if (isCancel(selectApps)) {
    cancel('👋 Has cancelled');
    process.exit(0);
  }

  if (selectApps.length === 1) {
    $.verbose = true;
    // 让控制台显示颜色
    process.env.FORCE_COLOR = '1';
    await $`pnpm --filter=${selectApps[0]} run ${command} `;
    return;
  }
  const filters = [];
  for (const app of selectApps) {
    filters.push(`--filter=${app}`);
  }
  $.verbose = true;
  // 让控制台显示颜色
  process.env.FORCE_COLOR = '1';
  await $`turbo run ${command} ${filters}`;
}

/**
 * 过滤app包
 * @param root
 * @param packages
 */
async function findApps(root: string, packages: Package[]) {
  // apps内的
  const appPackages = packages
    .filter((pkg) => {
      const viteConfigExists = fs.existsSync(join(pkg.dir, 'vite.config.mts'));
      return pkg.dir.startsWith(join(root, 'apps')) && viteConfigExists;
    })
    .map((pkg) => {
      return pkg.packageJson.name;
    });

  return appPackages;
}
