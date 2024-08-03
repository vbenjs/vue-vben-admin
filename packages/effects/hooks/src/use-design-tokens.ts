import { reactive, watch } from 'vue';

import { preferences } from '@vben/preferences';
import { updateCSSVariables } from '@vben/utils';

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
    colorError: '',
    colorInfo: '',
    colorPrimary: '',
    colorSuccess: '',
    colorTextBase: '',
    colorWarning: '',
  });

  const getCssVariableValue = (variable: string, isColor: boolean = true) => {
    const value = rootStyles.getPropertyValue(variable);
    return isColor ? `hsl(${value})` : value;
  };

  watch(
    () => preferences.theme,
    () => {
      tokens.colorPrimary = getCssVariableValue('--primary');

      tokens.colorError = getCssVariableValue('--destructive');

      tokens.colorWarning = getCssVariableValue('--warning');

      tokens.colorSuccess = getCssVariableValue('--success');

      tokens.colorTextBase = getCssVariableValue('--foreground');

      getCssVariableValue('--primary-foreground');

      tokens.colorBorder = getCssVariableValue('--border');

      tokens.colorBgElevated = getCssVariableValue('--popover');

      tokens.colorBgContainer = getCssVariableValue('--card');

      tokens.colorBgBase = getCssVariableValue('--background');

      tokens.borderRadius = getCssVariableValue('--radius', false);

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
    return isColor ? `hsl(${value})` : value;
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

      // antDesignTokens.colorBgMask = getCssVariableValue('--overlay');
    },
    { immediate: true },
  );

  return {
    commonTokens,
  };
}

export function useElementPlusDesignTokens() {
  const rootStyles = getComputedStyle(document.documentElement);

  const getCssVariableValue = (variable: string, isColor: boolean = true) => {
    const value = rootStyles.getPropertyValue(variable);
    return isColor ? `hsl(${value})` : value;
  };
  watch(
    () => preferences.theme,
    () => {
      const background = getCssVariableValue('--background');
      const border = getCssVariableValue('--border');
      const variables: Record<string, string> = {
        '--el-bg-color': background,
        '--el-bg-color-overlay': getCssVariableValue('--popover'),
        '--el-bg-color-page': getCssVariableValue('--background-deep'),
        '--el-border-color': border,
        '--el-border-color-dark': border,
        '--el-border-color-light': border,
        '--el-border-color-lighter': border,
        '--el-border-radius-base': getCssVariableValue('--radius', false),
        '--el-color-danger': getCssVariableValue('--destructive'),
        '--el-color-danger-light-3': getCssVariableValue('--destructive-600'),
        '--el-color-danger-light-5': getCssVariableValue('--destructive-700'),
        '--el-color-danger-light-7': getCssVariableValue('--destructive-800'),
        '--el-color-error-light-8': border,
        '--el-color-error-light-9': background,

        '--el-color-primary': getCssVariableValue('--primary'),
        '--el-color-primary-light-3': getCssVariableValue('--primary-600'),

        '--el-color-primary-light-5': getCssVariableValue('--primary-700'),
        '--el-color-primary-light-7': getCssVariableValue('--primary-800'),
        '--el-color-success': getCssVariableValue('--success'),
        '--el-color-success-light-3': getCssVariableValue('--success-600'),

        '--el-color-success-light-5': getCssVariableValue('--success-700'),
        '--el-color-success-light-7': getCssVariableValue('--success-800'),

        '--el-color-success-light-8': border,
        '--el-color-success-light-9': background,
        '--el-color-warning': getCssVariableValue('--warning'),
        '--el-color-warning-light-3': getCssVariableValue('--warning-600'),

        '--el-color-warning-light-5': getCssVariableValue('--warning-700'),
        '--el-color-warning-light-7': getCssVariableValue('--warning-800'),
        '--el-color-warning-light-8': border,
        '--el-color-warning-light-9': background,

        '--el-fill-color-blank': background,
        '--el-text-color-primary': getCssVariableValue('--foreground'),
        '--el-text-color-regular': getCssVariableValue('--foreground'),
      };
      updateCSSVariables(variables, `__vben_design_styles__`);
    },
    { immediate: true },
  );
}
