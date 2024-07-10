import type { DeepPartial } from '@vben-core/typings';

import type { Preferences } from './types';

import { preferencesManager } from './preferences';

// 偏好设置（带有层级关系）
const preferences: Preferences = preferencesManager.getPreferences();

// 更新偏好设置
const updatePreferences =
  preferencesManager.updatePreferences.bind(preferencesManager);

// 重置偏好设置
const resetPreferences =
  preferencesManager.resetPreferences.bind(preferencesManager);

const clearPreferencesCache =
  preferencesManager.clearCache.bind(preferencesManager);

function defineOverridesPreferences(preferences: DeepPartial<Preferences>) {
  return preferences;
}

export {
  clearPreferencesCache,
  defineOverridesPreferences,
  preferences,
  preferencesManager,
  resetPreferences,
  updatePreferences,
};

export * from './constants';
export type * from './types';
export * from './use-preferences';
