/* eslint-disable vue/one-component-per-file, vue/require-default-prop */

import type { App, Component } from 'vue';

import { createApp, defineComponent, h } from 'vue';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createThemeAwareButton } from '../theme-aware-button';

const mocks = vi.hoisted(() => ({
  compact: false,
  contextTheme: undefined as object | undefined,
  isDark: false,
  providerThemes: [] as any[],
  tokens: { colorPrimary: '#e11d48' },
}));

vi.mock('@vben/hooks', () => ({
  useAntdDesignTokens: () => ({ tokens: mocks.tokens }),
}));

vi.mock('@vben/preferences', () => ({
  preferences: {
    app: {
      get compact() {
        return mocks.compact;
      },
    },
  },
  usePreferences: () => ({
    isDark: {
      get value() {
        return mocks.isDark;
      },
    },
  }),
}));

vi.mock('antdv-next/config-provider/context', () => ({
  useConfig: () => ({ value: { theme: mocks.contextTheme } }),
}));

vi.mock('antdv-next', async () => {
  const { defineComponent, h } =
    await vi.importActual<typeof import('vue')>('vue');
  return {
    ConfigProvider: defineComponent({
      props: { theme: Object },
      setup(props, { slots }) {
        mocks.providerThemes.push(props.theme);
        return () =>
          h('section', { 'data-theme-provider': '' }, slots.default?.());
      },
    }),
    theme: {
      compactAlgorithm: 'compact',
      darkAlgorithm: 'dark',
      defaultAlgorithm: 'default',
    },
  };
});

const Button = defineComponent({
  inheritAttrs: false,
  props: { type: String },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        'button',
        { ...attrs, 'data-button-type': props.type },
        slots.default?.(),
      );
  },
});

let activeApp: App | undefined;

function mountButton(component: Component) {
  const container = document.createElement('div');
  document.body.append(container);
  activeApp = createApp(() =>
    h(component, { 'data-probe': 'button' }, () => 'Submit'),
  );
  activeApp.mount(container);
  return container;
}

beforeEach(() => {
  mocks.compact = false;
  mocks.contextTheme = undefined;
  mocks.isDark = false;
  mocks.providerThemes.length = 0;
});

afterEach(() => {
  activeApp?.unmount();
  activeApp = undefined;
  document.body.innerHTML = '';
});

describe('createThemeAwareButton', () => {
  it('uses the existing ConfigProvider context without adding a wrapper', () => {
    mocks.contextTheme = { token: mocks.tokens };
    const container = mountButton(createThemeAwareButton(Button, 'primary'));

    expect(container.querySelector('[data-theme-provider]')).toBeNull();
    expect(container.querySelector('button')?.dataset.buttonType).toBe(
      'primary',
    );
    expect(container.querySelector('button')?.dataset.probe).toBe('button');
  });

  it('provides the current Vben theme when no ConfigProvider is present', () => {
    mocks.compact = true;
    mocks.isDark = true;
    const container = mountButton(createThemeAwareButton(Button, 'default'));

    expect(container.querySelector('[data-theme-provider]')).not.toBeNull();
    expect(mocks.providerThemes).toEqual([
      {
        algorithm: ['dark', 'compact'],
        token: mocks.tokens,
      },
    ]);
    expect(container.querySelector('button')?.dataset.buttonType).toBe(
      'default',
    );
  });
});
