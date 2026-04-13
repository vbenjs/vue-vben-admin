import type { Preferences } from './types';

import { preferencesManager } from './preferences';

export const {
  getPreferences,
  getCustomPreferences,
  getInitialCustomPreferences,
  getPreferencesExtension,
  updatePreferences,
  updateCustomPreferences,
  resetPreferences,
  clearCache,
  initPreferences,
} = preferencesManager;

export const preferences: Preferences = getPreferences();

export { preferencesManager };

export * from './constants';
export type * from './types';
export * from './use-preferences';
