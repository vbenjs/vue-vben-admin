import { execaCommand, getPackages } from '@vben/node-utils';

import { cancel, isCancel, select } from '@clack/prompts';

interface RunOptions {
  command?: string;
}

export async function run(options: RunOptions) {
  const { command } = options;
  if (!command) {
    console.error('Please enter the command to run');
    process.exit(1);
  }
  const { packages } = await getPackages();
  // const appPkgs = await findApps(process.cwd(), packages);
  // const websitePkg = packages.find(
  //   (item) => item.packageJson.name === '@vben/website',
  // );

  // 只显示有对应命令的包
  const selectPkgs = packages.filter((pkg) => {
    return (pkg?.packageJson as Record<string, any>)?.scripts?.[command];
  });

  const selectPkg = await select<any, string>({
    message: `Select the app you need to run [${command}]:`,
    options: selectPkgs.map((item) => ({
      label: item?.packageJson.name,
      value: item?.packageJson.name,
    })),
  });

  if (isCancel(selectPkg) || !selectPkg) {
    cancel('👋 Has cancelled');
    process.exit(0);
  }

  execaCommand(`pnpm --filter=${selectPkg} run ${command}`, {
    stdio: 'inherit',
  });
  // const filters = [];
  // for (const app of selectApps) {
  //   filters.push(`--filter=${app}`);
  // }
  // $.verbose = true;
  // execaCommand(`turbo run ${command} ${filters}`, {
  //   stdio: 'inherit',
  // });
}

/**
 * 过滤app包
 * @param root
 * @param packages
 */
// async function findApps(root: string, packages: Package[]) {
//   // apps内的
//   const appPackages = packages.filter((pkg) => {
//     const viteConfigExists = fs.existsSync(join(pkg.dir, 'vite.config.mts'));
//     return pkg.dir.startsWith(join(root, 'apps')) && viteConfigExists;
//   });

//   return appPackages;
// }
