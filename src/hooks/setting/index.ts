import type { ProjectConfig, GlobConfig, GlobEnvConfig } from '/#/config';

import { getConfigFileName } from '../../../build/getConfigFileName';

import getProjectSetting from '/@/settings/projectSetting';

import { warn } from '/@/utils/log';
import { getGlobEnvConfig, isDevMode } from '/@/utils/env';

export const useGlobSetting = (): Readonly<GlobConfig> => {
  const ENV_NAME = getConfigFileName(import.meta.env);

  const ENV = ((isDevMode()
    ? getGlobEnvConfig()
    : window[ENV_NAME as any]) as unknown) as GlobEnvConfig;

  const {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_API_URL,
    VITE_GLOB_APP_SHORT_NAME,
    VITE_GLOB_API_URL_PREFIX,
    VITE_GLOB_UPLOAD_URL,
  } = ENV;

  if (!/[a-zA-Z\_]*/.test(VITE_GLOB_APP_SHORT_NAME)) {
    warn(
      `VITE_GLOB_APP_SHORT_NAME Variables can only be characters/underscores, please modify in the environment variables and re-running.`
    );
  }

  // Take global configuration
  const glob: Readonly<GlobConfig> = {
    title: VITE_GLOB_APP_TITLE,
    apiUrl: VITE_GLOB_API_URL,
    shortName: VITE_GLOB_APP_SHORT_NAME,
    urlPrefix: VITE_GLOB_API_URL_PREFIX,
    uploadUrl: VITE_GLOB_UPLOAD_URL,
  };
  return glob as Readonly<GlobConfig>;
};

export const useProjectSetting = (): ProjectConfig => {
  // TODO computed
  return getProjectSetting;
};
