/**
 * Generate additional configuration files when used for packaging. The file can be configured with some global variables, so that it can be changed directly externally without repackaging
 */
import { GLOB_CONFIG_FILE_NAME } from '../constant';
import fs, { writeFileSync } from 'fs-extra';

import viteConfig from '../../vite.config';
import { errorConsole, successConsole, getCwdPath, getEnvConfig } from '../utils';
import { getShortName } from '../getShortName';

function createConfig(
  {
    configName,
    config,
    configFileName = GLOB_CONFIG_FILE_NAME,
  }: { configName: string; config: any; configFileName?: string } = { configName: '', config: {} }
) {
  try {
    const windowConf = `window.${configName}`;
    const outDir = viteConfig.outDir || 'dist';
    // Ensure that the variable will not be modified
    const configStr = `${windowConf}=${JSON.stringify(config)};

      Object.freeze(${windowConf});
      Object.defineProperty(window, "${configName}", {
        configurable: false,
        writable: false,
      });
    `;
    fs.mkdirp(getCwdPath(outDir));
    writeFileSync(getCwdPath(`${outDir}/${configFileName}`), configStr);

    successConsole('The configuration file is build successfully！');
  } catch (error) {
    errorConsole('Configuration file configuration file failed to package\n' + error);
  }
}

export function runBuildConfig() {
  const config = getEnvConfig();
  const configFileName = getShortName(config);
  createConfig({ config, configName: configFileName });
}
