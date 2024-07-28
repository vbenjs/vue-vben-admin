import type { PluginOption } from 'vite';

import { dateUtil, getPackages, readPackageJSON } from '@vben/node-utils';

function resolvePackageVersion(
  pkgsMeta: Record<string, string>,
  name: string,
  value: string,
) {
  if (value.includes('workspace')) {
    return pkgsMeta[name];
  }
  return value;
}

async function resolveMonorepoDependencies() {
  const { packages } = await getPackages();

  const resultDevDependencies: Record<string, string> = {};
  const resultDependencies: Record<string, string> = {};
  const pkgsMeta: Record<string, string> = {};

  for (const { packageJson } of packages) {
    pkgsMeta[packageJson.name] = packageJson.version;
  }

  for (const { packageJson } of packages) {
    const { dependencies = {}, devDependencies = {} } = packageJson;
    for (const [key, value] of Object.entries(dependencies)) {
      resultDependencies[key] = resolvePackageVersion(pkgsMeta, key, value);
    }
    for (const [key, value] of Object.entries(devDependencies)) {
      resultDevDependencies[key] = resolvePackageVersion(pkgsMeta, key, value);
    }
  }
  return {
    dependencies: resultDependencies,
    devDependencies: resultDevDependencies,
  };
}

/**
 * 用于注入项目信息
 */
async function viteMetadataPlugin(
  root = process.cwd(),
): Promise<PluginOption | undefined> {
  const { author, description, homepage, license, version } =
    await readPackageJSON(root);

  const buildTime = dateUtil().format('YYYY-MM-DD HH:mm:ss');

  return {
    async config() {
      const { dependencies, devDependencies } =
        await resolveMonorepoDependencies();

      const isAuthorObject = typeof author === 'object';
      const authorName = isAuthorObject ? author.name : author;
      const authorEmail = isAuthorObject ? author.email : null;
      const authorUrl = isAuthorObject ? author.url : null;

      return {
        define: {
          __VBEN_ADMIN_METADATA__: JSON.stringify({
            authorEmail,
            authorName,
            authorUrl,
            buildTime,
            dependencies,
            description,
            devDependencies,
            homepage,
            license,
            version,
          }),
          'import.meta.env.VITE_APP_VERSION': JSON.stringify(version),
        },
      };
    },
    enforce: 'post',
    name: 'vite:inject-metadata',
  };
}

export { viteMetadataPlugin };
