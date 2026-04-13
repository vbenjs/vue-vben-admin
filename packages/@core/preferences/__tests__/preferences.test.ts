import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { defaultPreferences } from '../src/config';
import { isDarkTheme } from '../src/update-css-variables';

describe('preferences', () => {
  let PreferenceManager: typeof import('../src/preferences').PreferenceManager;
  let preferenceManager: InstanceType<
    typeof import('../src/preferences').PreferenceManager
  >;

  // 模拟 window.matchMedia 方法
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query) => ({
      addEventListener: vi.fn(),
      addListener: vi.fn(), // Deprecated
      dispatchEvent: vi.fn(),
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      removeEventListener: vi.fn(),
      removeListener: vi.fn(), // Deprecated
    })),
  );

  vi.stubGlobal('localStorage', {
    clear: vi.fn(),
    getItem: vi.fn(() => null),
    key: vi.fn(() => null),
    length: 0,
    removeItem: vi.fn(),
    setItem: vi.fn(),
  });

  vi.stubGlobal('sessionStorage', {
    clear: vi.fn(),
    getItem: vi.fn(() => null),
    key: vi.fn(() => null),
    length: 0,
    removeItem: vi.fn(),
    setItem: vi.fn(),
  });

  beforeAll(async () => {
    ({ PreferenceManager } = await import('../src/preferences'));
  });

  beforeEach(() => {
    vi.mocked(localStorage.getItem).mockImplementation(() => null);
    vi.mocked(localStorage.removeItem).mockReset();
    vi.mocked(localStorage.setItem).mockReset();
    vi.mocked(sessionStorage.getItem).mockImplementation(() => null);
    vi.mocked(sessionStorage.removeItem).mockReset();
    vi.mocked(sessionStorage.setItem).mockReset();
    preferenceManager = new PreferenceManager();
  });

  it('loads default preferences if no saved preferences found', () => {
    const preferences = preferenceManager.getPreferences();
    expect(preferences).toEqual(defaultPreferences);
  });

  it('initializes preferences with overrides', async () => {
    const overrides: any = {
      app: {
        locale: 'en-US',
      },
    };
    await preferenceManager.initPreferences({
      namespace: 'testNamespace',
      overrides,
    });

    // 等待防抖动操作完成
    // await new Promise((resolve) => setTimeout(resolve, 300)); // 等待100毫秒

    const expected = {
      ...defaultPreferences,
      app: {
        ...defaultPreferences.app,
        ...overrides.app,
      },
    };

    expect(preferenceManager.getPreferences()).toEqual(expected);
  });

  it('updates theme mode correctly', () => {
    preferenceManager.updatePreferences({
      theme: {
        mode: 'light',
      },
    });

    expect(preferenceManager.getPreferences().theme.mode).toBe('light');
  });

  it('updates color modes correctly', () => {
    preferenceManager.updatePreferences({
      app: { colorGrayMode: true, colorWeakMode: true },
    });

    expect(preferenceManager.getPreferences().app.colorGrayMode).toBe(true);
    expect(preferenceManager.getPreferences().app.colorWeakMode).toBe(true);
  });

  it('resets preferences to default', () => {
    // 先更新一些偏好设置
    preferenceManager.updatePreferences({
      theme: {
        mode: 'light',
      },
    });

    // 然后重置偏好设置
    preferenceManager.resetPreferences();

    expect(preferenceManager.getPreferences()).toEqual(defaultPreferences);
  });

  it('updates isMobile correctly', () => {
    // 模拟移动端状态
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation((query) => ({
        addEventListener: vi.fn(),
        addListener: vi.fn(),
        dispatchEvent: vi.fn(),
        matches: query === '(max-width: 768px)',
        media: query,
        onchange: null,
        removeEventListener: vi.fn(),
        removeListener: vi.fn(),
      })),
    );

    preferenceManager.updatePreferences({
      app: { isMobile: true },
    });

    expect(preferenceManager.getPreferences().app.isMobile).toBe(true);
  });

  it('updates the locale preference correctly', () => {
    preferenceManager.updatePreferences({
      app: { locale: 'en-US' },
    });

    expect(preferenceManager.getPreferences().app.locale).toBe('en-US');
  });

  it('updates the sidebar width correctly', () => {
    preferenceManager.updatePreferences({
      sidebar: { width: 200 },
    });

    expect(preferenceManager.getPreferences().sidebar.width).toBe(200);
  });
  it('updates the sidebar collapse state correctly', () => {
    preferenceManager.updatePreferences({
      sidebar: { collapsed: true },
    });

    expect(preferenceManager.getPreferences().sidebar.collapsed).toBe(true);
  });
  it('updates the navigation style type correctly', () => {
    preferenceManager.updatePreferences({
      navigation: { styleType: 'flat' },
    } as any);

    expect(preferenceManager.getPreferences().navigation.styleType).toBe(
      'flat',
    );
  });

  it('resets preferences to default correctly', () => {
    // 先更新一些偏好设置
    preferenceManager.updatePreferences({
      app: { locale: 'en-US' },
      sidebar: { collapsed: true, width: 200 },
      theme: {
        mode: 'light',
      },
    });

    // 然后重置偏好设置
    preferenceManager.resetPreferences();

    expect(preferenceManager.getPreferences()).toEqual(defaultPreferences);
  });

  it('does not update undefined preferences', () => {
    const originalPreferences = preferenceManager.getPreferences();

    preferenceManager.updatePreferences({
      app: { nonexistentField: 'value' },
    } as any);

    expect(preferenceManager.getPreferences()).toEqual(originalPreferences);
  });

  it('reverts to default when a preference field is deleted', () => {
    preferenceManager.updatePreferences({
      app: { locale: 'en-US' },
    });

    preferenceManager.updatePreferences({
      app: { locale: undefined },
    });

    expect(preferenceManager.getPreferences().app.locale).toBe('en-US');
  });

  it('ignores updates with invalid preference value types', () => {
    const originalPreferences = preferenceManager.getPreferences();

    preferenceManager.updatePreferences({
      app: { isMobile: 'true' as unknown as boolean }, // 错误类型
    });

    expect(preferenceManager.getPreferences()).toEqual(originalPreferences);
  });

  it('merges nested preference objects correctly', () => {
    preferenceManager.updatePreferences({
      app: { name: 'New App Name' },
    });

    const expected = {
      ...defaultPreferences,
      app: {
        ...defaultPreferences.app,
        name: 'New App Name',
      },
    };

    expect(preferenceManager.getPreferences()).toEqual(expected);
  });

  it('applies updates immediately after initialization', async () => {
    const overrides: any = {
      app: {
        locale: 'en-US',
      },
    };

    await preferenceManager.initPreferences({
      namespace: 'apply-updates',
      overrides,
    });

    preferenceManager.updatePreferences({
      theme: { mode: 'light' },
    });

    expect(preferenceManager.getPreferences().theme.mode).toBe('light');
  });

  it('initializes custom preferences extension with default values', async () => {
    const extension = {
      fields: [
        {
          component: 'switch',
          defaultValue: true,
          key: 'enableWorkbench',
          label: '启用工作台',
        },
        {
          component: 'select',
          defaultValue: 'single',
          key: 'tenantMode',
          label: '租户模式',
          options: [
            { label: '单租户', value: 'single' },
            { label: '多租户', value: 'multi' },
          ],
        },
      ],
      tabLabel: '扩展',
      title: '业务偏好',
    } as const;

    await preferenceManager.initPreferences({
      extension,
      namespace: 'custom-defaults',
    });

    expect(preferenceManager.getPreferencesExtension()).toEqual(extension);
    expect(preferenceManager.getCustomPreferences()).toEqual({
      enableWorkbench: true,
      tenantMode: 'single',
    });
  });

  it('does not expose mutable custom preference baselines or extension schema', async () => {
    const extension = {
      fields: [
        {
          component: 'number',
          componentProps: {
            max: 10,
            min: 2,
            step: 2,
          },
          defaultValue: 4,
          key: 'pageSize',
          label: '分页大小',
        },
      ],
      tabLabel: '扩展',
      title: '业务偏好',
    } as const;

    await preferenceManager.initPreferences({
      extension,
      namespace: 'custom-readonly',
    });

    const initialCustomPreferences =
      preferenceManager.getInitialCustomPreferences<{
        pageSize: number;
      }>() as { pageSize: number };
    const preferencesExtension = preferenceManager.getPreferencesExtension<{
      pageSize: number;
    }>() as {
      fields: Array<{ componentProps?: { max?: number }; label: string }>;
    };
    const [firstField] = preferencesExtension.fields;

    initialCustomPreferences.pageSize = 8;
    expect(firstField).toBeDefined();
    expect(firstField?.componentProps).toBeDefined();

    if (!firstField || !firstField.componentProps) {
      return;
    }

    firstField.label = '已修改';
    firstField.componentProps.max = 20;

    expect(preferenceManager.getInitialCustomPreferences()).toEqual({
      pageSize: 4,
    });
    expect(preferenceManager.getPreferencesExtension()).toEqual(extension);
  });

  it('updates and resets custom preferences correctly', async () => {
    await preferenceManager.initPreferences({
      extension: {
        fields: [
          {
            component: 'number',
            defaultValue: 20,
            key: 'pageSize',
            label: '分页大小',
          },
          {
            component: 'input',
            defaultValue: '日报',
            key: 'reportTitle',
            label: '报表标题',
          },
        ],
        tabLabel: '扩展',
      },
      namespace: 'custom-reset',
    });

    preferenceManager.updateCustomPreferences({
      pageSize: 50,
      reportTitle: '月报',
    });

    expect(preferenceManager.getCustomPreferences()).toEqual({
      pageSize: 50,
      reportTitle: '月报',
    });

    preferenceManager.resetPreferences();

    expect(preferenceManager.getCustomPreferences()).toEqual({
      pageSize: 20,
      reportTitle: '日报',
    });
  });

  it('ignores invalid custom preferences updates', async () => {
    await preferenceManager.initPreferences({
      extension: {
        fields: [
          {
            component: 'switch',
            defaultValue: true,
            key: 'enableWorkbench',
            label: '启用工作台',
          },
          {
            component: 'select',
            defaultValue: 'single',
            key: 'tenantMode',
            label: '租户模式',
            options: [
              { label: '单租户', value: 'single' },
              { label: '多租户', value: 'multi' },
            ],
          },
        ],
        tabLabel: '扩展',
      },
      namespace: 'custom-invalid',
    });

    const originalCustomPreferences = preferenceManager.getCustomPreferences();

    preferenceManager.updateCustomPreferences({
      enableWorkbench: 'true' as unknown as boolean,
      tenantMode: 'unknown',
      unknownField: 'value',
    } as any);

    expect(preferenceManager.getCustomPreferences()).toEqual(
      originalCustomPreferences,
    );
  });

  it('enforces custom number field min max and step constraints', async () => {
    await preferenceManager.initPreferences({
      extension: {
        fields: [
          {
            component: 'number',
            componentProps: {
              max: 10,
              min: 2,
              step: 2,
            },
            defaultValue: 4,
            key: 'pageSize',
            label: '分页大小',
          },
        ],
        tabLabel: '扩展',
      },
      namespace: 'custom-number-constraints',
    });

    preferenceManager.updateCustomPreferences({
      pageSize: 8,
    });

    expect(preferenceManager.getCustomPreferences()).toEqual({
      pageSize: 8,
    });

    preferenceManager.updateCustomPreferences({
      pageSize: 1,
    });

    expect(preferenceManager.getCustomPreferences()).toEqual({
      pageSize: 8,
    });

    preferenceManager.updateCustomPreferences({
      pageSize: 12,
    });

    expect(preferenceManager.getCustomPreferences()).toEqual({
      pageSize: 8,
    });

    preferenceManager.updateCustomPreferences({
      pageSize: 5,
    });

    expect(preferenceManager.getCustomPreferences()).toEqual({
      pageSize: 8,
    });
  });

  it('filters cached custom number values that violate field constraints', async () => {
    vi.mocked(localStorage.getItem).mockImplementation((key) => {
      if (key.endsWith('cache-preferences-custom')) {
        return JSON.stringify({
          value: {
            pageSize: 5,
          },
        });
      }

      return null;
    });

    await preferenceManager.initPreferences({
      extension: {
        fields: [
          {
            component: 'number',
            componentProps: {
              max: 10,
              min: 2,
              step: 2,
            },
            defaultValue: 4,
            key: 'pageSize',
            label: '分页大小',
          },
        ],
        tabLabel: '扩展',
      },
      namespace: 'custom-number-cache',
    });

    expect(preferenceManager.getCustomPreferences()).toEqual({
      pageSize: 4,
    });
  });
});

describe('isDarkTheme', () => {
  it('should return true for dark theme', () => {
    expect(isDarkTheme('dark')).toBe(true);
  });

  it('should return false for light theme', () => {
    expect(isDarkTheme('light')).toBe(false);
  });

  it('should return system preference for auto theme', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
      addEventListener: vi.fn(),
      addListener: vi.fn(), // Deprecated
      dispatchEvent: vi.fn(),
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      removeEventListener: vi.fn(),
      removeListener: vi.fn(), // Deprecated
    }));

    expect(isDarkTheme('auto')).toBe(true);
    expect(window.matchMedia).toHaveBeenCalledWith(
      '(prefers-color-scheme: dark)',
    );
  });
});
