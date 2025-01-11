import type { App, Component } from 'vue';

import { h, watchEffect } from 'vue';
import { setDefaultProps, Tippy as TippyComponent } from 'vue-tippy';

import { usePreferences } from '@vben-core/preferences';

import useTippyDirective from './directive';

import './theme.css';

const { isDark } = usePreferences();

export function initTippy(app: App<Element>) {
  setDefaultProps({
    allowHTML: true,
    delay: [500, 200],
    theme: isDark.value ? '' : 'light',
  });
  watchEffect(() => {
    setDefaultProps({ theme: isDark.value ? '' : 'light' });
  });
  app.directive('tippy', useTippyDirective(isDark));
}

export const Tippy: Component = (props, { attrs, slots }) => {
  return h(
    TippyComponent,
    { theme: isDark.value ? '' : 'light', ...props, ...attrs },
    slots,
  );
};
