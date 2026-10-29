import type { Component } from 'vue';

import { computed, defineComponent, h } from 'vue';

import { useAntdDesignTokens } from '@vben/hooks';
import { preferences, usePreferences } from '@vben/preferences';

import { useConfig } from 'antdv-next/config-provider/context';
import ConfigProvider from 'antdv-next/dist/config-provider/index';
import theme from 'antdv-next/dist/theme/index';

function createThemeAwareButton(
  Button: Component,
  type: 'default' | 'primary',
) {
  return defineComponent({
    inheritAttrs: false,
    setup(props, { attrs, slots }) {
      const config = useConfig();
      if (config.value?.theme) {
        return () => h(Button, { ...attrs, ...props, type }, slots);
      }

      // Imperative alerts mount in a separate tree without the app provider.
      const { isDark } = usePreferences();
      const { tokens } = useAntdDesignTokens();
      const buttonTheme = computed(() => {
        const algorithm = [
          isDark.value ? theme.darkAlgorithm : theme.defaultAlgorithm,
        ];
        if (preferences.app.compact) {
          algorithm.push(theme.compactAlgorithm);
        }
        return { algorithm, token: tokens };
      });

      return () =>
        h(
          ConfigProvider,
          { theme: buttonTheme.value },
          {
            default: () => h(Button, { ...attrs, ...props, type }, slots),
          },
        );
    },
  });
}

export { createThemeAwareButton };
