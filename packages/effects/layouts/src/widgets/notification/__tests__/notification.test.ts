import type { App } from 'vue';

import { createApp, h } from 'vue';

import { afterEach, describe, expect, it } from 'vitest';

import Notification from '../notification.vue';

let activeApp: App | undefined;

afterEach(() => {
  activeApp?.unmount();
  activeApp = undefined;
  document.body.innerHTML = '';
});

describe('notification popup', () => {
  it('renders the notification status indicator as a circle', () => {
    const host = document.createElement('div');
    document.body.append(host);

    activeApp = createApp({
      render: () => h(Notification, { dot: true }),
    });
    activeApp.mount(host);

    const indicator = host.querySelector<HTMLElement>('.bell-button > span');

    expect(indicator).not.toBeNull();
    expect(indicator?.classList).toContain('rounded-full');
    expect(indicator?.classList).not.toContain('rounded-sm');
  });
});
