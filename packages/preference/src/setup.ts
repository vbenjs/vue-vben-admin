import type { DeepPartial, Preference } from '@vben-core/typings';

import { PreferenceCache } from './cache';
import { overridesPreference } from './preference';

interface SetupPreferenceOptions {
  /**
   * @zh_CN 环境
   */
  env: string;
  /**
   * @zh_CN 应用名,由于 @vben/preference 是公用的，后续可能有多个app，为了防止多个app缓存冲突，可在这里配置应用名
   * 应用名将被用于持久化的前缀
   */
  namespace: string;
  /**
   * @zh_CN app自行覆盖偏好设置
   */
  overrides?: DeepPartial<Preference>;
}

async function setupPreference(options: SetupPreferenceOptions) {
  const { env, namespace, overrides = {} } = options;
  const cache = new PreferenceCache(`${namespace}-${env}`);
  overridesPreference(overrides, cache);
}

export { setupPreference };

export type { SetupPreferenceOptions };
