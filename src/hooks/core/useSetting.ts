import type { ProjectConfig, GlobConfig, SettingWrap } from '/@/types/config';

import getProjectSetting from '/@/settings/projectSetting';

export const useSetting = (): SettingWrap => {
  // Take global configuration
  const glob: Readonly<GlobConfig> = {
    title: 'vben admin 2.0',
    apiUrl: '/api',
    shortName: 'vben_admin_v2',
    urlPrefix: '',
  };
  const projectSetting: Readonly<ProjectConfig> = getProjectSetting;

  return {
    globSetting: glob as Readonly<GlobConfig>,
    projectSetting,
  };
};
