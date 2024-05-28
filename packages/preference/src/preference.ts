import type {
  DeepPartial,
  Preference,
  PreferenceKeys,
} from '@vben-core/typings';

import { convertToHslCssVar, merge } from '@vben-core/toolkit';

import type { Ref } from 'vue';

import { breakpointsTailwind, useBreakpoints, useCssVar } from '@vueuse/core';
import { markRaw, reactive, ref, watch } from 'vue';

import { defaultPreference } from './config';

import type { PreferenceCacheType } from './cache';

/**
 * 当前偏好设置
 */
const currentPreference: Preference = reactive(defaultPreference);
/**
 * 当前偏好设置原始值
 */
const initialPreference: Ref<Preference> = ref(defaultPreference);

let preferenceCache: PreferenceCacheType;

/**
 * 是否监听过系统设置变化
 */
let isRegisterListen = false;

function updatePreference(key: keyof Preference, value: boolean | string): void;
function updatePreference(
  preference: DeepPartial<Preference>,
  value?: undefined,
): void;

/**
 * 更新偏好设置
 * @param  preference - 一个部分偏好设置对象，它将被合并到当前偏好设置中。
 */
function updatePreference(preference: any, value: any) {
  if (typeof preference === 'string') {
    updatePreference({ [preference]: value }, value);
  } else {
    const updateKeys = Object.keys(preference) as PreferenceKeys[];

    const mergePreference = merge(preference, markRaw(currentPreference));

    Object.assign(currentPreference, mergePreference);

    // 当修改到颜色变量时，更新 css 变量
    if (updateKeys.includes('colorPrimary')) {
      updateCssVar(currentPreference);
    }

    // 更新主题
    if (updateKeys.includes('theme')) {
      updateTheme(currentPreference);
    }

    // 更新页面颜色模式（灰色、色弱）
    if (
      updateKeys.includes('colorGrayMode') ||
      updateKeys.includes('colorWeakMode')
    ) {
      updateColorMode(currentPreference);
    }

    preferenceCache.set(currentPreference);
  }
}

/**
 * 更新 CSS 变量
 * @param  preference - 当前偏好设置对象，它的颜色值将被转换成 HSL 格式并设置为 CSS 变量。
 */
function updateCssVar(preference: Preference) {
  for (const [key, value] of Object.entries(preference)) {
    if (['colorPrimary'].includes(key)) {
      const cssVarKey = key.replaceAll(/([A-Z])/g, '-$1').toLowerCase();
      const cssVarValue = useCssVar(`--${cssVarKey}`);
      cssVarValue.value = convertToHslCssVar(value);
    }
  }
}

/**
 * 更新主题
 * @param preference - 当前偏好设置对象，它的主题值将被用来设置文档的主题。
 */
function updateTheme(preference: Preference) {
  // 当修改到颜色变量时，更新 css 变量
  const root = document.documentElement;
  if (root) {
    const dark = isDarkTheme(preference.theme);
    root.classList.toggle('dark', dark);
  }

  // 只需要监听一次即可
  listenOnce(preference);
}

/**
 * 更新页面颜色模式（灰色、色弱）
 * @param preference
 */
function updateColorMode(preference: Preference) {
  const { colorGrayMode, colorWeakMode } = preference;
  const body = document.body;
  const COLOR_WEAK = 'invert-mode';
  const COLOR_GRAY = 'grayscale-mode';
  colorWeakMode
    ? body.classList.add(COLOR_WEAK)
    : body.classList.remove(COLOR_WEAK);
  colorGrayMode
    ? body.classList.add(COLOR_GRAY)
    : body.classList.remove(COLOR_GRAY);
}

/**
 * 1. 监听系统主题偏好设置变化
 * 2. 监听断点，判断是否移动端
 * @param preference - 当前偏好设置对象，当系统主题偏好变化时，它的主题值会被更新。
 */
function listenOnce(preference: Preference) {
  if (isRegisterListen) {
    return;
  }
  isRegisterListen = true;
  // 监听系统主题偏好设置变化
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', ({ matches: isDark }) => {
      preference.theme = isDark ? 'dark' : 'light';
      updateTheme(preference);
    });

  // 监听断点，判断是否移动端
  const breakpoints = useBreakpoints(breakpointsTailwind);
  const isMobile = breakpoints.smaller('md');
  watch(
    () => isMobile.value,
    (val) => {
      currentPreference.isMobile = val;
    },
    { immediate: true },
  );
}

/**
 * 重置偏好设置
 * 偏好设置将被重置为初始值，并从 localStorage 中移除。
 */
function resetPreference() {
  Object.assign(currentPreference, initialPreference.value);
  updatePreference(currentPreference);
  preferenceCache.remove();
}

/**
 * 配置当前app默认的偏好配置
 * @param overrides
 */
function overridesPreference(
  overrides: DeepPartial<Preference>,
  cache: PreferenceCacheType,
) {
  preferenceCache = cache;
  /**
   * 重置状态时用到的原始值
   */
  initialPreference.value = merge(overrides, defaultPreference);
  const mergedPreference = merge(
    overrides,
    preferenceCache.get(defaultPreference),
  );
  updatePreference(mergedPreference);
}

function isDarkTheme(theme: string) {
  let dark = theme === 'dark';
  if (theme === 'auto') {
    dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return dark;
}

export {
  currentPreference,
  initialPreference,
  isDarkTheme,
  overridesPreference,
  resetPreference,
  updatePreference,
};
