import type { ProjectConfig, GlobConfig, SettingWrap, GlobEnvConfig } from '/@/types/config';

import getProjectSetting from '/@/settings/projectSetting';

import { getGlobEnvConfig, isDevMode } from '/@/utils/env';
import { getShortName } from '../../../build/getShortName';

const ENV_NAME = getShortName(import.meta.env);
const ENV = ((isDevMode()
  ? getGlobEnvConfig()
  : window[ENV_NAME as any]) as unknown) as GlobEnvConfig;
const {
  VITE_GLOB_APP_TITLE,
  VITE_GLOB_API_URL,
  VITE_GLOB_APP_SHORT_NAME,
  VITE_GLOB_API_URL_PREFIX,
} = ENV;

export const useSetting = (): SettingWrap => {
  // Take global configuration
  const glob: Readonly<GlobConfig> = {
    title: VITE_GLOB_APP_TITLE,
    apiUrl: VITE_GLOB_API_URL,
    shortName: VITE_GLOB_APP_SHORT_NAME,
    urlPrefix: VITE_GLOB_API_URL_PREFIX,
  };
  const projectSetting: Readonly<ProjectConfig> = getProjectSetting;
  return {
    globSetting: glob as Readonly<GlobConfig>,
    projectSetting,
  };
};
