import type { App, Component, VNode } from 'vue';

import { createApp, defineComponent, h, nextTick, ref } from 'vue';

import { updatePreferences } from '@vben/preferences';

import Button from 'antdv-next/dist/button/index';
import ConfigProvider from 'antdv-next/dist/config-provider/index';
import theme from 'antdv-next/dist/theme/index';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createThemeAwareButton } from '../theme-aware-button';

let app: App | undefined;

// Read the real theme reaching the button slot, without relying on happy-dom's
// support for CSS-in-JS stylesheets and CSS custom properties.
const TokenProbe = defineComponent({
  setup() {
    const { token } = theme.useToken();
    return () =>
      h(
        'span',
        {
          'data-height': token.value.controlHeight,
          'data-primary-color': token.value.colorPrimary,
          'data-text-color': token.value.colorText,
        },
        'Cancel',
      );
  },
});

function mountButton(
  component: Component,
  wrap: (button: VNode) => VNode = (button) => button,
  buttonProps: { disabled?: boolean } = {},
) {
  const onClick = vi.fn();
  const container = document.createElement('div');
  document.body.append(container);
  app = createApp(() =>
    wrap(
      h(component, { ...buttonProps, 'data-probe': 'action', onClick }, () =>
        h(TokenProbe),
      ),
    ),
  );
  app.mount(container);
  const button = container.querySelector('button');
  if (!button) {
    throw new Error('Expected the adapter to render a button');
  }
  return {
    button,
    onClick,
    probe: () => {
      const probe = container.querySelector<HTMLSpanElement>(
        'span[data-text-color]',
      );
      if (!probe) {
        throw new Error('Expected the button slot to render the theme probe');
      }
      return probe.dataset;
    },
  };
}

afterEach(() => {
  app?.unmount();
  app = undefined;
  document.body.innerHTML = '';
  document.documentElement.style.removeProperty('--foreground');
  document.documentElement.style.removeProperty('--primary');
  updatePreferences({ app: { compact: false }, theme: { mode: 'light' } });
});

describe('playground adapter buttons', () => {
  it('inherits a parent theme added after mounting and restores the fallback when removed', async () => {
    document.documentElement.style.setProperty('--foreground', '0 0% 100%');
    document.documentElement.style.setProperty('--primary', '0 100% 50%');
    updatePreferences({ theme: { mode: 'dark' } });
    const parentTheme = ref<{ token: { colorPrimary: string } }>();
    const { probe } = mountButton(
      createThemeAwareButton(Button, 'default'),
      (button) => h(ConfigProvider, { theme: parentTheme.value }, () => button),
    );
    expect(probe().textColor).toBe('rgba(255,255,255,0.85)');
    const fallbackPrimary = probe().primaryColor;
    expect(fallbackPrimary).not.toBe('#123456');

    parentTheme.value = { token: { colorPrimary: '#123456' } };
    await nextTick();
    expect(probe().primaryColor).toBe('#123456');

    parentTheme.value = undefined;
    await nextTick();
    expect(probe().textColor).toBe('rgba(255,255,255,0.85)');
    expect(probe().primaryColor).toBe(fallbackPrimary);
  });

  it('restores the Vben fallback when an initially present parent theme is removed', async () => {
    document.documentElement.style.setProperty('--foreground', '0 0% 100%');
    updatePreferences({ theme: { mode: 'dark' } });
    const parentTheme = ref<undefined | { token: { colorText: string } }>({
      token: { colorText: '#123456' },
    });
    const { probe } = mountButton(
      createThemeAwareButton(Button, 'primary'),
      (button) => h(ConfigProvider, { theme: parentTheme.value }, () => button),
    );
    expect(probe().textColor).toBe('#123456');

    parentTheme.value = undefined;
    await nextTick();
    expect(probe().textColor).toBe('rgba(255,255,255,0.85)');
  });

  it.each(['default', 'primary'] as const)(
    'keeps an independent %s button in sync with theme and compact preferences',
    async (type) => {
      // The application stylesheet normally supplies this base theme variable.
      document.documentElement.style.setProperty('--foreground', '0 0% 100%');
      updatePreferences({ theme: { mode: 'dark' } });
      const { button, onClick, probe } = mountButton(
        createThemeAwareButton(Button, type),
      );
      await nextTick();

      expect(probe().textColor).toBe('rgba(255,255,255,0.85)');
      expect(probe().height).toBe('32');
      expect(button.classList.contains(`ant-btn-${type}`)).toBe(true);
      expect(button.dataset.probe).toBe('action');
      button.click();
      expect(onClick).toHaveBeenCalledTimes(1);

      document.documentElement.style.setProperty('--foreground', '0 0% 0%');
      updatePreferences({ theme: { mode: 'light' } });
      await nextTick();
      expect(probe().textColor).toBe('rgba(0,0,0,0.88)');

      updatePreferences({ app: { compact: true } });
      await nextTick();
      expect(probe().height).toBe('28');
    },
  );

  it.each(['default', 'primary'] as const)(
    'preserves an existing provider for a %s button',
    async (type) => {
      updatePreferences({ app: { compact: true }, theme: { mode: 'dark' } });
      const textColor = ref('#123456');
      const { button, onClick, probe } = mountButton(
        createThemeAwareButton(Button, type),
        (button) =>
          h(
            ConfigProvider,
            {
              theme: {
                token: { colorText: textColor.value, controlHeight: 47 },
              },
            },
            () => button,
          ),
        { disabled: true },
      );
      expect(button.disabled).toBe(true);
      button.click();
      expect(onClick).not.toHaveBeenCalled();
      expect(probe().textColor).toBe('#123456');
      expect(probe().height).toBe('47');

      textColor.value = '#654321';
      await nextTick();
      expect(probe().textColor).toBe('#654321');
    },
  );
});
