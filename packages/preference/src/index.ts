import type { Preference } from '@vben-core/typings';

import { readonly } from 'vue';

import {
  currentPreference,
  resetPreference,
  updatePreference,
} from './preference';

export { staticPreference } from './config';

// 只读偏好设置
const preference: Readonly<Preference> = readonly(currentPreference);

export * from './setup';

export { preference, resetPreference, updatePreference };
export * from './use-preference';
