import { reactive, watch } from 'vue';

import { preferences, usePreferences } from '@vben/preferences';
import { convertToRgb, updateCSSVariables } from '@vben/utils';

/**
 * 用于适配各个框架的设计系统
 */

export function useAntdDesignTokens() {
  const rootStyles = getComputedStyle(document.documentElement);

  const tokens = reactive({
    borderRadius: '' as any,
    colorBgBase: '',
    colorBgContainer: '',
    colorBgElevated: '',
    colorBgLayout: '',
    colorBgMask: '',
    colorBorder: '',
    colorBorderSecondary: '',
    colorError: '',
    colorInfo: '',
    colorPrimary: '',
    colorSuccess: '',
    colorTextBase: '',
    colorWarning: '',
    zIndexPopupBase: 2000, // 调整基础弹层层级，避免下拉等组件被弹窗或者最大化状态下的表格遮挡
  });

  const getCssVariableValue = (variable: string, isColor: boolean = true) => {
    const value = rootStyles.getPropertyValue(variable);
    return isColor ? `hsl(${value})` : value;
  };

  watch(
    () => preferences.theme,
    () => {
      tokens.colorPrimary = getCssVariableValue('--primary');

      tokens.colorInfo = getCssVariableValue('--primary');

      tokens.colorError = getCssVariableValue('--destructive');

      tokens.colorWarning = getCssVariableValue('--warning');

      tokens.colorSuccess = getCssVariableValue('--success');

      tokens.colorTextBase = getCssVariableValue('--foreground');

      getCssVariableValue('--primary-foreground');

      tokens.colorBorderSecondary = tokens.colorBorder =
        getCssVariableValue('--border');

      tokens.colorBgElevated = getCssVariableValue('--popover');

      tokens.colorBgContainer = getCssVariableValue('--card');

      tokens.colorBgBase = getCssVariableValue('--background');

      const radius = Number.parseFloat(getCssVariableValue('--radius', false));
      // 1rem = 16px
      tokens.borderRadius = radius * 16;

      tokens.colorBgLayout = getCssVariableValue('--background-deep');
      tokens.colorBgMask = getCssVariableValue('--overlay');
    },
    { immediate: true },
  );

  return {
    tokens,
  };
}

export function useNaiveDesignTokens() {
  const rootStyles = getComputedStyle(document.documentElement);

  const commonTokens = reactive({
    baseColor: '',
    bodyColor: '',
    borderColor: '',
    borderRadius: '',
    cardColor: '',
    dividerColor: '',
    errorColor: '',
    errorColorHover: '',
    errorColorPressed: '',
    errorColorSuppl: '',
    invertedColor: '',
    modalColor: '',
    popoverColor: '',
    primaryColor: '',
    primaryColorHover: '',
    primaryColorPressed: '',
    primaryColorSuppl: '',
    successColor: '',
    successColorHover: '',
    successColorPressed: '',
    successColorSuppl: '',
    tableColor: '',
    textColorBase: '',
    warningColor: '',
    warningColorHover: '',
    warningColorPressed: '',
    warningColorSuppl: '',
  });

  const getCssVariableValue = (variable: string, isColor: boolean = true) => {
    const value = rootStyles.getPropertyValue(variable);
    return isColor ? convertToRgb(`hsl(${value})`) : value;
  };

  watch(
    () => preferences.theme,
    () => {
      commonTokens.primaryColor = getCssVariableValue('--primary');
      commonTokens.primaryColorHover = getCssVariableValue('--primary-600');
      commonTokens.primaryColorPressed = getCssVariableValue('--primary-700');
      commonTokens.primaryColorSuppl = getCssVariableValue('--primary-800');

      commonTokens.errorColor = getCssVariableValue('--destructive');
      commonTokens.errorColorHover = getCssVariableValue('--destructive-600');
      commonTokens.errorColorPressed = getCssVariableValue('--destructive-700');
      commonTokens.errorColorSuppl = getCssVariableValue('--destructive-800');

      commonTokens.warningColor = getCssVariableValue('--warning');
      commonTokens.warningColorHover = getCssVariableValue('--warning-600');
      commonTokens.warningColorPressed = getCssVariableValue('--warning-700');
      commonTokens.warningColorSuppl = getCssVariableValue('--warning-800');

      commonTokens.successColor = getCssVariableValue('--success');
      commonTokens.successColorHover = getCssVariableValue('--success-600');
      commonTokens.successColorPressed = getCssVariableValue('--success-700');
      commonTokens.successColorSuppl = getCssVariableValue('--success-800');

      commonTokens.textColorBase = getCssVariableValue('--foreground');

      commonTokens.baseColor = getCssVariableValue('--primary-foreground');

      commonTokens.dividerColor = commonTokens.borderColor =
        getCssVariableValue('--border');

      commonTokens.modalColor = commonTokens.popoverColor =
        getCssVariableValue('--popover');

      commonTokens.tableColor = commonTokens.cardColor =
        getCssVariableValue('--card');

      commonTokens.bodyColor = getCssVariableValue('--background');
      commonTokens.invertedColor = getCssVariableValue('--background-deep');

      commonTokens.borderRadius = getCssVariableValue('--radius', false);
    },
    { immediate: true },
  );
  return {
    commonTokens,
  };
}

export function useElementPlusDesignTokens() {
  const { isDark } = usePreferences();
  const rootStyles = getComputedStyle(document.documentElement);

  const getCssVariableValueRaw = (variable: string) => {
    return rootStyles.getPropertyValue(variable);
  };

  const getCssVariableValue = (variable: string, isColor: boolean = true) => {
    const value = getCssVariableValueRaw(variable);
    return isColor ? convertToRgb(`hsl(${value})`) : value;
  };

  watch(
    () => preferences.theme,
    () => {
      const background = getCssVariableValue('--background');
      const border = getCssVariableValue('--border');
      const accent = getCssVariableValue('--accent');

      const variables: Record<string, string> = {
        '--el-bg-color': background,
        '--el-bg-color-overlay': getCssVariableValue('--popover'),
        '--el-bg-color-page': getCssVariableValue('--background-deep'),
        '--el-border-color': border,
        '--el-border-color-dark': border,
        '--el-border-color-extra-light': border,
        '--el-border-color-hover': accent,
        '--el-border-color-light': border,
        '--el-border-color-lighter': border,

        '--el-border-radius-base': getCssVariableValue('--radius', false),
        '--el-color-danger': getCssVariableValue('--destructive-500'),
        '--el-color-danger-dark-2': isDark.value
          ? getCssVariableValue('--destructive-400')
          : getCssVariableValue('--destructive-600'),
        '--el-color-danger-light-3': isDark.value
          ? getCssVariableValue('--destructive-600')
          : getCssVariableValue('--destructive-400'),
        '--el-color-danger-light-5': isDark.value
          ? getCssVariableValue('--destructive-700')
          : getCssVariableValue('--destructive-300'),
        '--el-color-danger-light-7': isDark.value
          ? getCssVariableValue('--destructive-800')
          : getCssVariableValue('--destructive-200'),
        '--el-color-danger-light-8': isDark.value
          ? getCssVariableValue('--destructive-900')
          : getCssVariableValue('--destructive-100'),
        '--el-color-danger-light-9': isDark.value
          ? getCssVariableValue('--destructive-950')
          : getCssVariableValue('--destructive-50'),

        '--el-color-error': getCssVariableValue('--destructive-500'),
        '--el-color-error-dark-2': isDark.value
          ? getCssVariableValue('--destructive-400')
          : getCssVariableValue('--destructive-600'),
        '--el-color-error-light-3': isDark.value
          ? getCssVariableValue('--destructive-600')
          : getCssVariableValue('--destructive-400'),
        '--el-color-error-light-5': isDark.value
          ? getCssVariableValue('--destructive-700')
          : getCssVariableValue('--destructive-300'),
        '--el-color-error-light-7': isDark.value
          ? getCssVariableValue('--destructive-800')
          : getCssVariableValue('--destructive-200'),
        '--el-color-error-light-8': isDark.value
          ? getCssVariableValue('--destructive-900')
          : getCssVariableValue('--destructive-100'),
        '--el-color-error-light-9': isDark.value
          ? getCssVariableValue('--destructive-950')
          : getCssVariableValue('--destructive-50'),

        '--el-color-info-light-5': border,
        '--el-color-info-light-8': border,
        '--el-color-info-light-9': getCssVariableValue('--info'), // getCssVariableValue('--secondary'),

        '--el-color-primary': getCssVariableValue('--primary-500'),
        '--el-color-primary-dark-2': isDark.value
          ? getCssVariableValue('--primary-400')
          : getCssVariableValue('--primary-600'),
        '--el-color-primary-light-3': isDark.value
          ? getCssVariableValue('--primary-600')
          : getCssVariableValue('--primary-400'),
        '--el-color-primary-light-5': isDark.value
          ? getCssVariableValue('--primary-700')
          : getCssVariableValue('--primary-300'),
        '--el-color-primary-light-7': isDark.value
          ? getCssVariableValue('--primary-800')
          : getCssVariableValue('--primary-200'),
        '--el-color-primary-light-8': isDark.value
          ? getCssVariableValue('--primary-900')
          : getCssVariableValue('--primary-100'),
        '--el-color-primary-light-9': isDark.value
          ? getCssVariableValue('--primary-950')
          : getCssVariableValue('--primary-50'),

        '--el-color-success': getCssVariableValue('--success-500'),
        '--el-color-success-dark-2': isDark.value
          ? getCssVariableValue('--success-400')
          : getCssVariableValue('--success-600'),
        '--el-color-success-light-3': isDark.value
          ? getCssVariableValue('--success-600')
          : getCssVariableValue('--success-400'),
        '--el-color-success-light-5': isDark.value
          ? getCssVariableValue('--success-700')
          : getCssVariableValue('--success-300'),
        '--el-color-success-light-7': isDark.value
          ? getCssVariableValue('--success-800')
          : getCssVariableValue('--success-200'),
        '--el-color-success-light-8': isDark.value
          ? getCssVariableValue('--success-900')
          : getCssVariableValue('--success-100'),
        '--el-color-success-light-9': isDark.value
          ? getCssVariableValue('--success-950')
          : getCssVariableValue('--success-50'),

        '--el-color-warning': getCssVariableValue('--warning-500'),
        '--el-color-warning-dark-2': isDark.value
          ? getCssVariableValue('--warning-400')
          : getCssVariableValue('--warning-600'),
        '--el-color-warning-light-3': isDark.value
          ? getCssVariableValue('--warning-600')
          : getCssVariableValue('--warning-400'),
        '--el-color-warning-light-5': isDark.value
          ? getCssVariableValue('--warning-700')
          : getCssVariableValue('--warning-300'),
        '--el-color-warning-light-7': isDark.value
          ? getCssVariableValue('--warning-800')
          : getCssVariableValue('--warning-200'),
        '--el-color-warning-light-8': isDark.value
          ? getCssVariableValue('--warning-900')
          : getCssVariableValue('--warning-100'),
        '--el-color-warning-light-9': isDark.value
          ? getCssVariableValue('--warning-950')
          : getCssVariableValue('--warning-50'),

        '--el-fill-color': getCssVariableValue('--accent'),
        '--el-fill-color-blank': background,
        '--el-fill-color-light': getCssVariableValue('--accent'),
        '--el-fill-color-lighter': getCssVariableValue('--accent-lighter'),

        '--el-fill-color-dark': getCssVariableValue('--accent-dark'),
        '--el-fill-color-darker': getCssVariableValue('--accent-darker'),

        // 解决ElLoading背景色问题
        '--el-mask-color': isDark.value
          ? 'rgba(0,0,0,.8)'
          : 'rgba(255,255,255,.9)',

        '--el-text-color-primary': getCssVariableValue('--foreground'),

        '--el-text-color-regular': getCssVariableValue('--foreground'),
      };

      updateCSSVariables(variables, `__vben_design_styles__`);
    },
    { immediate: true },
  );
}

export function useTDesignDesignTokens() {
  const { isDark } = usePreferences();
  const rootStyles = getComputedStyle(document.documentElement);

  const getCssVariableValue = (variable: string, isColor: boolean = true) => {
    const value = rootStyles.getPropertyValue(variable);
    return isColor ? convertToRgb(`hsl(${value})`) : value;
  };

  /**
   * 生成某个语义色对应的 TDesign 变量（语义变体 + 1~10 色阶）。
   * TDesign 的色阶在亮色模式下 1 最浅、10 最深，暗色模式下方向相反，
   * 这里根据当前模式把 Vben 的 50~900 色板映射到对应方向。
   * @param tdName TDesign 颜色名，如 `brand`、`error`
   * @param vbenName Vben 颜色名，如 `primary`、`destructive`
   */
  const getColorTokens = (tdName: string, vbenName: string) => {
    const dark = isDark.value;
    const getColor = (level?: number) =>
      getCssVariableValue(
        level === undefined ? `--${vbenName}` : `--${vbenName}-${level}`,
      );

    // 亮色模式 1 最浅、10 最深；暗色模式相反
    const lightScale = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
    const scaleLevels = dark ? [...lightScale].toReversed() : lightScale;
    const scale: Record<string, string> = {};
    scaleLevels.forEach((level, index) => {
      scale[`--td-${tdName}-color-${index + 1}`] = getColor(level);
    });

    return {
      [`--td-${tdName}-color`]: getColor(),
      [`--td-${tdName}-color-active`]: getColor(dark ? 300 : 700),
      [`--td-${tdName}-color-disabled`]: getColor(dark ? 800 : 200),
      [`--td-${tdName}-color-focus`]: getColor(dark ? 900 : 100),
      [`--td-${tdName}-color-hover`]: getColor(dark ? 400 : 600),
      [`--td-${tdName}-color-light`]: getColor(dark ? 950 : 50),
      [`--td-${tdName}-color-light-hover`]: getColor(dark ? 900 : 100),
      ...scale,
    };
  };

  watch(
    () => preferences.theme,
    () => {
      const variables: Record<string, string> = {
        // 品牌色（主题色）、功能色
        ...getColorTokens('brand', 'primary'),
        ...getColorTokens('error', 'destructive'),
        ...getColorTokens('warning', 'warning'),
        ...getColorTokens('success', 'success'),

        // 文字颜色
        '--td-text-color-anti': getCssVariableValue('--primary-foreground'),
        '--td-text-color-brand': getCssVariableValue('--primary'),
        '--td-text-color-disabled': getCssVariableValue('--muted-foreground'),
        '--td-text-color-link': getCssVariableValue('--primary'),
        '--td-text-color-placeholder': getCssVariableValue(
          '--input-placeholder',
        ),
        '--td-text-color-primary': getCssVariableValue('--foreground'),
        '--td-text-color-secondary': getCssVariableValue('--muted-foreground'),

        // 背景颜色
        '--td-bg-color-component': getCssVariableValue('--accent'),
        '--td-bg-color-component-active':
          getCssVariableValue('--accent-darker'),
        '--td-bg-color-component-disabled': getCssVariableValue('--muted'),
        '--td-bg-color-component-hover': getCssVariableValue('--accent-hover'),
        '--td-bg-color-container': getCssVariableValue('--background'),
        '--td-bg-color-container-active':
          getCssVariableValue('--accent-darker'),
        '--td-bg-color-container-hover': getCssVariableValue('--accent'),
        '--td-bg-color-container-select': getCssVariableValue('--accent'),
        '--td-bg-color-page': getCssVariableValue('--background-deep'),
        '--td-bg-color-secondarycontainer': getCssVariableValue('--card'),

        // 边框颜色
        '--td-border-level-1-color': getCssVariableValue('--border'),
        '--td-border-level-2-color': getCssVariableValue('--border'),
        '--td-component-border': getCssVariableValue('--border'),
        '--td-component-stroke': getCssVariableValue('--border'),

        // 圆角
        '--td-radius-default': getCssVariableValue('--radius', false),
      };

      // TDesign 将亮/暗变量定义在 `:root[theme-mode='light'|'dark']` 下，
      // 需要写入相同优先级的选择器才能覆盖默认值
      const selector = isDark.value
        ? `:root[theme-mode='dark']`
        : `:root[theme-mode='light']`;

      updateCSSVariables(variables, `__vben_design_tdesign_styles__`, selector);
    },
    { immediate: true },
  );
}
