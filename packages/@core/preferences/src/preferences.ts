import type { DeepPartial } from '@vben-core/typings';

import type {
  CustomPreferencesField,
  CustomPreferencesRecord,
  InitialOptions,
  Preferences,
  PreferencesExtension,
} from './types';

import { markRaw, reactive, readonly, watch } from 'vue';

import { StorageManager } from '@vben-core/shared/cache';
import { isMacOs, merge } from '@vben-core/shared/utils';

import {
  breakpointsTailwind,
  useBreakpoints,
  useDebounceFn,
} from '@vueuse/core';

import { defaultPreferences } from './config';
import { updateCSSVariables } from './update-css-variables';

const STORAGE_KEYS = {
  CUSTOM: 'preferences-custom',
  MAIN: 'preferences',
  LOCALE: 'preferences-locale',
  THEME: 'preferences-theme',
} as const;

class PreferenceManager {
  private cache: StorageManager;
  private customPreferencesExtension: null | PreferencesExtension<any> = null;
  private customState = reactive<CustomPreferencesRecord>({});
  private debouncedSave: () => void;
  private initialCustomPreferences: CustomPreferencesRecord = {};
  private initialPreferences: Preferences = defaultPreferences;
  private isInitialized = false;
  private state: Preferences;

  constructor() {
    this.cache = new StorageManager();
    this.state = reactive<Preferences>(
      this.loadFromCache() || { ...defaultPreferences },
    );
    this.debouncedSave = useDebounceFn(() => this.saveToCache(), 150);
  }

  /**
   * 清除所有缓存的偏好设置
   */
  clearCache = () => {
    Object.values(STORAGE_KEYS).forEach((key) => this.cache.removeItem(key));
  };

  /**
   * 获取扩展偏好设置
   */
  getCustomPreferences = <
    TCustomPreferences extends object = CustomPreferencesRecord,
  >() => {
    return readonly(this.customState) as Readonly<TCustomPreferences>;
  };

  /**
   * 获取初始化扩展偏好设置
   */
  getInitialCustomPreferences = <
    TCustomPreferences extends object = CustomPreferencesRecord,
  >() => {
    return this.cloneValue(
      this.initialCustomPreferences,
    ) as Readonly<TCustomPreferences>;
  };

  /**
   * 获取初始化偏好设置
   */
  getInitialPreferences = () => {
    return this.initialPreferences;
  };

  /**
   * 获取当前偏好设置（只读）
   */
  getPreferences = () => {
    return readonly(this.state);
  };

  /**
   * 获取扩展偏好设置配置
   */
  getPreferencesExtension = <
    TCustomPreferences extends object = CustomPreferencesRecord,
  >() => {
    return this.customPreferencesExtension
      ? (this.cloneValue(this.customPreferencesExtension) as Readonly<
          PreferencesExtension<TCustomPreferences>
        >)
      : null;
  };

  /**
   * 初始化偏好设置
   * @param options - 初始化配置项
   * @param options.namespace - 命名空间，用于隔离不同应用的配置
   * @param options.overrides - 要覆盖的偏好设置
   */
  initPreferences = async <
    TCustomPreferences extends object = CustomPreferencesRecord,
  >({
    namespace,
    overrides,
    extension,
  }: InitialOptions<TCustomPreferences>) => {
    // 防止重复初始化
    if (this.isInitialized) {
      return;
    }

    // 使用命名空间初始化存储管理器
    this.cache = new StorageManager({ prefix: namespace });

    // 合并初始偏好设置
    this.initialPreferences = merge({}, overrides, defaultPreferences);
    this.customPreferencesExtension = extension ?? null;
    this.initialCustomPreferences = this.resolveCustomPreferencesDefaults(
      this.customPreferencesExtension,
    );

    // 加载缓存的偏好设置并与初始配置合并
    const cachedPreferences = this.loadFromCache() || {};
    const mergedPreference = merge(
      {},
      cachedPreferences,
      this.initialPreferences,
    );

    // 更新偏好设置
    this.updatePreferences(mergedPreference);
    this.replaceCustomPreferences(
      merge(
        {},
        this.sanitizeCustomPreferences(this.loadCustomFromCache() || {}),
        this.initialCustomPreferences,
      ),
    );
    this.saveToCache();

    // 设置监听器
    this.setupWatcher();

    // 初始化平台标识
    this.initPlatform();

    this.isInitialized = true;
  };

  /**
   * 重置偏好设置到初始状态
   */
  resetPreferences = () => {
    // 将状态重置为初始偏好设置
    Object.assign(this.state, this.initialPreferences);
    this.replaceCustomPreferences(this.initialCustomPreferences);

    // 保存偏好设置至缓存
    this.saveToCache();

    // 直接触发 UI 更新
    this.handleUpdates(this.state);
  };

  /**
   * 更新扩展偏好设置
   * @param updates - 要更新的扩展偏好设置
   */
  updateCustomPreferences = <
    TCustomPreferences extends object = CustomPreferencesRecord,
  >(
    updates: DeepPartial<TCustomPreferences>,
  ) => {
    if (!this.customPreferencesExtension) {
      return;
    }

    const sanitizedUpdates = this.sanitizeCustomPreferences(
      updates as DeepPartial<CustomPreferencesRecord>,
    );

    if (Object.keys(sanitizedUpdates).length === 0) {
      return;
    }

    this.replaceCustomPreferences(
      merge({}, sanitizedUpdates, markRaw(this.customState)),
    );
    this.debouncedSave();
  };

  /**
   * 更新偏好设置
   * @param updates - 要更新的偏好设置
   */
  updatePreferences = (updates: DeepPartial<Preferences>) => {
    // 深度合并更新内容和当前状态
    const mergedState = merge({}, updates, markRaw(this.state));
    Object.assign(this.state, mergedState);

    // 根据更新的值执行更新
    this.handleUpdates(updates);

    // 保存到缓存
    this.debouncedSave();
  };

  private cloneValue<T>(value: T): T {
    if (Array.isArray(value)) {
      return value.map((item) => this.cloneValue(item)) as T;
    }

    if (value && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value as Record<string, unknown>).map(
          ([key, nestedValue]) => [key, this.cloneValue(nestedValue)],
        ),
      ) as T;
    }

    return value;
  }

  /**
   * 处理更新
   * @param updates - 更新的偏好设置
   */
  private handleUpdates(updates: DeepPartial<Preferences>) {
    const { theme, app } = updates;

    if (
      theme &&
      (Object.keys(theme).length > 0 || Reflect.has(theme, 'fontSize'))
    ) {
      updateCSSVariables(this.state);
    }

    if (
      app &&
      (Reflect.has(app, 'colorGrayMode') || Reflect.has(app, 'colorWeakMode'))
    ) {
      this.updateColorMode(this.state);
    }
  }

  /**
   * 初始化平台标识
   */
  private initPlatform() {
    document.documentElement.dataset.platform = isMacOs() ? 'macOs' : 'window';
  }

  private isAlmostInteger(value: number, epsilon = Number.EPSILON * 10) {
    return Math.abs(value - Math.round(value)) < epsilon;
  }

  private isValidCustomPreferenceValue(
    field: CustomPreferencesField,
    value: unknown,
  ) {
    switch (field.component) {
      case 'number': {
        if (typeof value !== 'number' || !Number.isFinite(value)) {
          return false;
        }

        const max = this.resolveNumericConstraint(field.componentProps?.max);
        const min = this.resolveNumericConstraint(field.componentProps?.min);
        const step = this.resolveNumericConstraint(field.componentProps?.step);

        if (min !== undefined && value < min) {
          return false;
        }

        if (max !== undefined && value > max) {
          return false;
        }

        if (step !== undefined) {
          if (step <= 0) {
            return false;
          }

          const stepBase = min ?? 0;
          const stepCount = (value - stepBase) / step;

          if (!this.isAlmostInteger(stepCount)) {
            return false;
          }
        }

        return true;
      }
      case 'select': {
        return (
          typeof value === 'string' &&
          field.options.some((option) => option.value === value)
        );
      }
      case 'switch': {
        return typeof value === 'boolean';
      }
      default: {
        return typeof value === 'string';
      }
    }
  }

  /**
   * 从缓存加载扩展偏好设置
   * @returns 缓存的扩展偏好设置，如果不存在则返回 null
   */
  private loadCustomFromCache(): CustomPreferencesRecord | null {
    return this.cache.getItem<CustomPreferencesRecord>(STORAGE_KEYS.CUSTOM);
  }

  /**
   * 从缓存加载偏好设置
   * @returns 缓存的偏好设置，如果不存在则返回 null
   */
  private loadFromCache(): null | Preferences {
    return this.cache.getItem<Preferences>(STORAGE_KEYS.MAIN);
  }

  private replaceCustomPreferences(preferences: CustomPreferencesRecord) {
    Object.keys(this.customState).forEach((key) => {
      Reflect.deleteProperty(this.customState, key);
    });
    Object.assign(this.customState, preferences);
  }

  private resolveCustomPreferencesDefaults(
    extension: null | PreferencesExtension<any>,
  ) {
    if (!extension) {
      return {};
    }

    const result: CustomPreferencesRecord = {};

    for (const field of extension.fields) {
      result[field.key] = field.defaultValue;
    }

    return result;
  }

  private resolveNumericConstraint(value: unknown) {
    return typeof value === 'number' && Number.isFinite(value)
      ? value
      : undefined;
  }

  private sanitizeCustomPreferences(
    updates: DeepPartial<CustomPreferencesRecord>,
  ) {
    if (!this.customPreferencesExtension) {
      return {};
    }

    const result: CustomPreferencesRecord = {};

    for (const field of this.customPreferencesExtension.fields) {
      const value = updates[field.key];

      if (
        value !== undefined &&
        this.isValidCustomPreferenceValue(field, value)
      ) {
        result[field.key] = value;
      }
    }

    return result;
  }

  /**
   * 保存偏好设置到缓存
   */
  private saveToCache() {
    this.cache.setItem(STORAGE_KEYS.MAIN, this.state);
    this.cache.setItem(STORAGE_KEYS.LOCALE, this.state.app.locale);
    this.cache.setItem(STORAGE_KEYS.THEME, this.state.theme.mode);

    if (this.customPreferencesExtension) {
      this.cache.setItem(STORAGE_KEYS.CUSTOM, { ...this.customState });
      return;
    }

    this.cache.removeItem(STORAGE_KEYS.CUSTOM);
  }

  /**
   * 监听状态和系统偏好设置的变化
   */
  private setupWatcher() {
    if (this.isInitialized) {
      return;
    }

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
        // 仅在自动模式下跟随系统主题
        if (this.state.theme.mode === 'auto') {
          // 先应用实际的主题
          this.updatePreferences({
            theme: { mode: isDark ? 'dark' : 'light' },
          });
          // 再恢复为 auto 模式，保持跟随系统的状态
          this.updatePreferences({
            theme: { mode: 'auto' },
          });
        }
      });
  }

  /**
   * 更新页面颜色模式（灰色、色弱）
   * @param preference - 偏好设置
   */
  private updateColorMode(preference: Preferences) {
    const { colorGrayMode, colorWeakMode } = preference.app;
    const dom = document.documentElement;

    dom.classList.toggle('invert-mode', colorWeakMode);
    dom.classList.toggle('grayscale-mode', colorGrayMode);
  }
}

const preferencesManager = new PreferenceManager();

export { PreferenceManager, preferencesManager };
