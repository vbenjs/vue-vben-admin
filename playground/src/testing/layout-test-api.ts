import type { Preferences } from '@vben/preferences';

import {
  getPreferences,
  resetPreferences,
  updatePreferences,
} from '@vben/preferences';

type PreferenceUpdates = Parameters<typeof updatePreferences>[0];

interface LayoutTestApi {
  getPreferences: () => Preferences;
  resetPreferences: () => Promise<void>;
  updatePreferences: (updates: PreferenceUpdates) => void;
}

declare global {
  interface Window {
    __VBEN_LAYOUT_E2E__?: boolean;
    __VBEN_LAYOUT_TEST__?: LayoutTestApi;
  }
}

function clonePreferences() {
  return JSON.parse(JSON.stringify(getPreferences())) as Preferences;
}

function installLayoutTestApi() {
  window.__VBEN_LAYOUT_TEST__ = {
    getPreferences: clonePreferences,
    resetPreferences,
    updatePreferences,
  };
}

export { installLayoutTestApi };
