import type { ProjectConfig, GlobConfig, SettingWrap } from '/@/types/config';

import getProjectSetting from '/@/settings/projectSetting';

import { getGlobEnvConfig } from '../../../getEnvConfig';
const {
  VITE_GLOB_API_URL,
  VITE_GLOB_APP_SHORT_NAME,
  VITE_GLOB_APP_TITLE,
  VITE_GLOB_API_URL_PREFIX,
} = getGlobEnvConfig();

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
