import type { Preferences } from './types';

import { preferencesManager } from './preferences';

export const {
  getPreferences,
  updatePreferences,
  resetPreferences,
  clearCache,
  initPreferences,
} = preferencesManager;

export const preferences: Preferences = getPreferences();

export { preferencesManager };

export * from './constants';
export type * from './types';
export * from './use-preferences';
