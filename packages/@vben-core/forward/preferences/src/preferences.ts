import type {
  DeepPartial,
  Flatten,
  FlattenObjectKeys,
} from '@vben-core/typings';

import { StorageManager } from '@vben-core/cache';
import { flattenObject, nestedObject } from '@vben-core/helpers';
import { convertToHslCssVar, merge } from '@vben-core/toolkit';

import {
  breakpointsTailwind,
  useBreakpoints,
  useCssVar,
  useDebounceFn,
} from '@vueuse/core';
import { markRaw, reactive, watch } from 'vue';

import { defaultPreferences } from './config';

import type { Preferences } from './types';

const STORAGE_KEY = 'preferences';

interface initialOptions {
  namespace: string;
  overrides?: DeepPartial<Preferences>;
}

function isDarkTheme(theme: string) {
  let dark = theme === 'dark';
  if (theme === 'auto') {
    dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return dark;
}

class PreferenceManager {
  private cache: StorageManager<Preferences> | null = null;
  private flattenedState: Flatten<Preferences>;
  private initialPreferences: Preferences = defaultPreferences;
  private isInitialized: boolean = false;
  private savePreferences: (preference: Preferences) => void;
  private state: Preferences = reactive<Preferences>({
    ...this.loadPreferences(),
  });
  constructor() {
    this.cache = new StorageManager();
    this.flattenedState = reactive(flattenObject(this.state));

    this.savePreferences = useDebounceFn(
      (preference: Preferences) => this._savePreferences(preference),
      100,
    );
  }

  /**
   * 保存偏好设置
   * @param {Preferences} preference - 需要保存的偏好设置
   */
  private _savePreferences(preference: Preferences) {
    this.cache?.setItem(STORAGE_KEY, preference);
  }

  /**
   * 处理更新的键值
   * 根据更新的键值执行相应的操作。
   *
   * @param {DeepPartial<Preferences>} updates - 部分更新的偏好设置
   */
  private handleUpdates(updates: DeepPartial<Preferences>) {
    const themeUpdates = updates.theme || {};
    const appUpdates = updates.app || {};

    if (themeUpdates.colorPrimary) {
      this.updateCssVar(this.state);
    }

    if (appUpdates.themeMode) {
      this.updateTheme(this.state);
    }

    if (appUpdates.colorGrayMode || appUpdates.colorWeakMode) {
      this.updateColorMode(this.state);
    }
  }

  /**
   *  从缓存中加载偏好设置。如果缓存中没有找到对应的偏好设置，则返回默认偏好设置。
   */
  private loadCachedPreferences() {
    return this.cache?.getItem(STORAGE_KEY);
  }

  /**
   * 加载偏好设置
   * @returns {Preferences} 加载的偏好设置
   */
  private loadPreferences(): Preferences | null {
    return this.loadCachedPreferences() || { ...defaultPreferences };
  }

  /**
   * 监听状态和系统偏好设置的变化。
   */
  private setupWatcher() {
    if (this.isInitialized) {
      return;
    }

    const debounceWaterState = useDebounceFn(() => {
      const newFlattenedState = flattenObject(this.state);
      for (const k in newFlattenedState) {
        const key = k as FlattenObjectKeys<Preferences>;
        this.flattenedState[key] = newFlattenedState[key];
      }
      this.savePreferences(this.state);
    }, 16);

    const debounceWaterFlattenedState = useDebounceFn(
      (val: Flatten<Preferences>) => {
        this.updateState(val);
        this.savePreferences(this.state);
      },
      16,
    );

    // 监听 state 的变化
    watch(this.state, debounceWaterState, { deep: true });

    // 监听 flattenedState 的变化并触发 set 方法
    watch(this.flattenedState, debounceWaterFlattenedState, { deep: true });

    // 监听断点，判断是否移动端
    const breakpoints = useBreakpoints(breakpointsTailwind);
    const isMobile = breakpoints.smaller('md');
    watch(
      () => isMobile.value,
      (val) => {
        this.updatePreferences({
          app: { isMobile: val },
        });
      },
      { immediate: true },
    );

    // 监听系统主题偏好设置变化
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', ({ matches: isDark }) => {
        this.updatePreferences({
          app: { themeMode: isDark ? 'dark' : 'light' },
        });
        this.updateTheme(this.state);
      });
  }

  /**
   * 更新页面颜色模式（灰色、色弱）
   * @param preference
   */
  private updateColorMode(preference: Preferences) {
    if (preference.app) {
      const { colorGrayMode, colorWeakMode } = preference.app;
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
  }

  /**
   * 更新 CSS 变量
   * @param  preference - 当前偏好设置对象，它的颜色值将被转换成 HSL 格式并设置为 CSS 变量。
   */
  private updateCssVar(preference: Preferences) {
    if (preference.theme) {
      for (const [key, value] of Object.entries(preference.theme)) {
        if (['colorPrimary'].includes(key)) {
          const cssVarKey = key.replaceAll(/([A-Z])/g, '-$1').toLowerCase();
          const cssVarValue = useCssVar(`--${cssVarKey}`);
          cssVarValue.value = convertToHslCssVar(value);
        }
      }
    }
  }

  /**
   *  更新状态
   * 将新的扁平对象转换为嵌套对象，并与当前状态合并。
   * @param {FlattenObject<Preferences>} newValue - 新的扁平对象
   */
  private updateState(newValue: Flatten<Preferences>) {
    const nestObj = nestedObject(newValue, 2);
    Object.assign(this.state, merge(nestObj, this.state));
  }

  /**
   * 更新主题
   * @param preferences - 当前偏好设置对象，它的主题值将被用来设置文档的主题。
   */
  private updateTheme(preferences: Preferences) {
    // 当修改到颜色变量时，更新 css 变量
    const root = document.documentElement;
    if (root) {
      const themeMode = preferences?.app?.themeMode;
      if (!themeMode) {
        return;
      }
      const dark = isDarkTheme(themeMode);
      root.classList.toggle('dark', dark);
    }
  }

  public getFlatPreferences() {
    return this.flattenedState;
  }

  public getInitialPreferences() {
    return this.initialPreferences;
  }

  public getPreferences() {
    return this.state;
  }

  /**
   * 覆盖偏好设置
   * @param overrides - 要覆盖的偏好设置
   * @param namespace - 命名空间
   */
  public async initPreferences({ namespace, overrides }: initialOptions) {
    // 是否初始化过
    if (this.isInitialized) {
      return;
    }
    // 初始化存储管理器
    this.cache = new StorageManager({ prefix: namespace });
    // 合并初始偏好设置
    this.initialPreferences = merge({}, overrides, defaultPreferences);

    // 加载并合并当前存储的偏好设置
    const mergedPreference = merge({}, this.loadCachedPreferences(), overrides);

    // 更新偏好设置
    this.updatePreferences(mergedPreference);

    this.setupWatcher();
    // 标记为已初始化
    this.isInitialized = true;
  }

  /**
   * 重置偏好设置
   * 偏好设置将被重置为初始值，并从 localStorage 中移除。
   *
   * @example
   * 假设 initialPreferences 为 { theme: 'light', language: 'en' }
   * 当前 state 为 { theme: 'dark', language: 'fr' }
   * this.resetPreferences();
   * 调用后，state 将被重置为 { theme: 'light', language: 'en' }
   * 并且 localStorage 中的对应项将被移除
   */
  resetPreferences() {
    // 将状态重置为初始偏好设置
    Object.assign(this.state, this.initialPreferences);
    // 保存重置后的偏好设置
    this.savePreferences(this.state);
    // 从存储中移除偏好设置项
    this.cache?.removeItem(STORAGE_KEY);
  }

  /**
   * 更新偏好设置
   * @param updates - 要更新的偏好设置
   */
  public updatePreferences(updates: DeepPartial<Preferences>) {
    const mergedState = merge({}, updates, markRaw(this.state));

    Object.assign(this.state, mergedState);

    Object.assign(this.flattenedState, flattenObject(this.state));

    // 根据更新的键值执行相应的操作
    this.handleUpdates(updates);
    this.savePreferences(this.state);
  }
}

const preferencesManager = new PreferenceManager();
export { PreferenceManager, isDarkTheme, preferencesManager };
