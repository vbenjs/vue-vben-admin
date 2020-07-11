/**
 * 获取项目配置文件和全局变量
 */
// import { reactive, computed } from '@/setup/vue';
import getGlobConfig from 'config/getGlobConfig';
import readProjectSetting from '@/settings/projectSetting';
import * as getDesignSetting from '@/settings/designSetting';

import {
  ProjectConfig,
  GlobConfig,
  DesignConfig,
  SettingWrap,
  // SetProjectSettingFn,
} from '@/types/config';
/**
 * @description: 获取全局的静态配置
 */
export const useSetting = (): SettingWrap => {
  // 取全局配置
  const glob: Readonly<GlobConfig | {}> = getGlobConfig();
  // 获取项目配置
  const projectSetting: Readonly<ProjectConfig> = readProjectSetting;

  // 异步组件配置
  const designSetting: Readonly<DesignConfig> = getDesignSetting as DesignConfig;

  return {
    globSetting: glob as Readonly<GlobConfig>,
    projectSetting,
    designSetting: designSetting as Readonly<DesignConfig>,
  };
};

/**
 * @description: 获取项目动态配置
 */
// export const useDynamicProjectSetting = () => {
//   const projectSettingRef = reactive(readProjectSetting);

//   // 获取默认配置
//   const getProjectSetting = computed(() => projectSettingRef);

//   const setProjectSetting: SetProjectSettingFn = (key, value): void => {
//     projectSettingRef[key] = value;
//   };
//   return { getProjectSetting, setProjectSetting };
// };
