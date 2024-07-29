import { reactive, watch } from 'vue';

import { preferences } from '@vben/preferences';

export function useDesignTokens() {
  const rootStyles = getComputedStyle(document.documentElement);

  const antDesignTokens = reactive({
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
      antDesignTokens.colorPrimary = getCssVariableValue('--primary');
      antDesignTokens.colorError = getCssVariableValue('--destructive');
      antDesignTokens.colorWarning = getCssVariableValue('--warning');
      antDesignTokens.colorSuccess = getCssVariableValue('--success');
      antDesignTokens.colorBgBase = getCssVariableValue('--background');
      antDesignTokens.colorBgLayout = getCssVariableValue('--background-deep');
      antDesignTokens.colorBgMask = getCssVariableValue('--overlay');
      antDesignTokens.colorBorder = getCssVariableValue('--border');
      antDesignTokens.colorTextBase = getCssVariableValue('--foreground');
      antDesignTokens.colorBgElevated = getCssVariableValue('--popover');
      antDesignTokens.colorBgContainer = getCssVariableValue('--card');
      antDesignTokens.borderRadius = getCssVariableValue('--radius', false);
    },
    { immediate: true },
  );

  return {
    antDesignTokens,
  };
}
