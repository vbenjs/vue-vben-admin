import type {
  CustomPreferencesRecord,
  Preferences,
  PreferencesExtension,
} from '@vben-core/preferences';
import type { DeepPartial } from '@vben-core/typings';

/**
 * 如果你想所有的app都使用相同的默认偏好设置，你可以在这里定义
 * 而不是去修改 @vben-core/preferences 中的默认偏好设置
 * @param preferences
 * @returns
 */

function defineOverridesPreferences(preferences: DeepPartial<Preferences>) {
  return preferences;
}

function definePreferencesExtension<
  TCustomPreferences extends object = CustomPreferencesRecord,
>(extension: PreferencesExtension<TCustomPreferences>) {
  return extension;
}

/** 应用级 ICP 备案配置，供各 app 的 preferences 覆盖使用 */
const appCopyrightPreferences = {
  icp: '闽ICP备19024351号',
  icpLink: 'https://beian.miit.gov.cn/',
} satisfies DeepPartial<Preferences>['copyright'];

export {
  appCopyrightPreferences,
  defineOverridesPreferences,
  definePreferencesExtension,
};

export * from '@vben-core/preferences';
