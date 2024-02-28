import { pick } from 'lodash-es';
import { defHttp } from '@/utils/http/axios';

enum Api {
  sysConfig = '/admin/sysConfig',
  update = '/admin/sysConfig/update',
  version = '/admin/sysConfig/appVersion',
}

export interface SysConfig {
  configKey: string;
  configValue: string;
}
interface SysConfigData {
  [index: string]: string;
}
export const updateKeys = [
  'APP_CHECK_UPDATE_URL', // 应用检测更新地址
  'APP_UPDATE_URL', // 应用更新地址
];

export async function getSystemConfig(keys: string[]) {
  const setting: SysConfigData = {};
  const data = await defHttp.post<SysConfig[]>({
    url: Api.sysConfig,
    data: { keys },
  });
  data.map((item) => {
    setting[item.configKey] = item.configValue;
  });
  return setting;
}

export function updateSystemConfig<T extends keyof SysConfigData>(
  para: SysConfigData = {},
  keys: T[],
) {
  const data = pick(para, keys);
  const configs: SysConfig[] = [];
  Object.keys(data).map((key) => {
    configs.push({
      configKey: key,
      configValue: data[key],
    });
  });
  return defHttp.post<SysConfig[]>({
    url: Api.update,
    data: { configs },
  });
}

export function getAppVersion() {
  return defHttp.get<string>({
    url: Api.version,
  });
}
