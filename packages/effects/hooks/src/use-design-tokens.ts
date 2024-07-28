import { computed, ref, watch } from 'vue';

import { preferences } from '@vben/preferences';

export function useDesignTokens() {
  const rootStyles = getComputedStyle(document.documentElement);

  const colorPrimary = ref('');
  const colorError = ref('');
  const colorSuccess = ref('');
  const colorWarning = ref('');
  const colorInfo = ref('');
  const colorBgBase = ref('');
  const colorTextBase = ref('');
  const colorBgContainer = ref('');
  const colorBgElevated = ref('');
  const colorBgLayout = ref('');
  const colorBgMask = ref('');
  const colorBorder = ref('');
  const borderRadius = ref<any>('');

  const getCssVariableValue = (variable: string, isColor: boolean = true) => {
    const value = rootStyles.getPropertyValue(variable);
    return isColor ? `hsl(${value})` : value;
  };

  watch(
    () => preferences.theme,
    () => {
      colorInfo.value = colorPrimary.value = getCssVariableValue('--primary');
      colorError.value = getCssVariableValue('--destructive');
      colorWarning.value = getCssVariableValue('--warning');
      colorSuccess.value = getCssVariableValue('--success');
      colorBgBase.value = getCssVariableValue('--background');
      colorBgLayout.value = getCssVariableValue('--background-deep');
      colorBgMask.value = getCssVariableValue('--overlay');
      colorBorder.value = getCssVariableValue('--border');
      colorTextBase.value = getCssVariableValue('--foreground');
      colorBgElevated.value = getCssVariableValue('--popover');
      colorBgContainer.value = getCssVariableValue('--card');
      borderRadius.value = getCssVariableValue('--radius', false);
    },
    { immediate: true },
  );

  const antDesignTokens = computed(() => {
    return {
      borderRadius: borderRadius.value,
      colorBgBase: colorBgBase.value,
      colorBgContainer: colorBgContainer.value,
      colorBgElevated: colorBgElevated.value,
      colorBgLayout: colorBgLayout.value,
      colorBgMask: colorBgMask.value,
      colorBorder: colorBorder.value,
      colorError: colorError.value,
      colorInfo: colorInfo.value,
      colorPrimary: colorPrimary.value,
      colorSuccess: colorSuccess.value,
      colorTextBase: colorTextBase.value,
      colorWarning: colorWarning.value,
    };
  });

  return {
    antDesignTokens,
    borderRadius,
    colorBgBase,
    colorBgContainer,
    colorBgElevated,
    colorBorder,
    colorError,
    colorInfo,
    colorPrimary,
    colorSuccess,
    colorTextBase,
    colorWarning,
  };
}
