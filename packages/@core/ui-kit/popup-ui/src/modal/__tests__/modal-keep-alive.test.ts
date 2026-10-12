import type { App } from 'vue';

import type { ModalApiOptions } from '../modal';

import {
  createApp,
  defineComponent,
  h,
  KeepAlive,
  nextTick,
  onDeactivated,
  ref,
  shallowRef,
} from 'vue';

import { ELEMENT_ID_MAIN_CONTENT } from '@vben-core/shared/constants';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { useVbenModal } from '../use-modal';

let activeApp: App | undefined;

async function settle() {
  await nextTick();
  await nextTick();
  await nextTick();
}

function getDraftInput() {
  const input = document.querySelector<HTMLInputElement>('[data-draft="A"]');
  if (!input) throw new Error('Modal draft input was not mounted');
  return input;
}

function getDialog() {
  const dialog = document.querySelector<HTMLElement>('[role="dialog"]');
  if (!dialog) throw new Error('Modal dialog was not mounted');
  return dialog;
}

function isDisplayed(element: Element | null) {
  if (!(element instanceof HTMLElement) || !element.isConnected) return false;
  for (
    let current: HTMLElement | null = element;
    current;
    current = current.parentElement
  ) {
    const style = getComputedStyle(current);
    if (
      current.hidden ||
      style.display === 'none' ||
      style.visibility === 'hidden'
    )
      return false;
  }
  return true;
}

async function mountCachedPages(
  options: Pick<
    ModalApiOptions,
    | 'appendToMain'
    | 'destroyOnClose'
    | 'onBeforeClose'
    | 'onClosed'
    | 'onOpenChange'
    | 'onOpened'
  > & {
    connected?: boolean;
    openInitially?: boolean;
    pageBModal?: boolean;
    scrollable?: boolean;
  } = {},
) {
  const {
    appendToMain = true,
    connected = false,
    destroyOnClose = false,
    openInitially = true,
    pageBModal = false,
    scrollable = false,
    ...callbacks
  } = options;
  if (scrollable) {
    // happy-dom has no layout engine; provide the dimensions of a scrollable body.
    vi.spyOn(document.body, 'scrollHeight', 'get').mockReturnValue(1200);
    vi.spyOn(document.body, 'clientHeight', 'get').mockReturnValue(600);
  }
  const style = document.createElement('style');
  // The unit environment does not compile Tailwind. Supply its visibility utility.
  style.textContent = '.hidden { display: none; }';
  document.body.append(style);
  const main = document.createElement('main');
  main.id = ELEMENT_ID_MAIN_CONTENT;
  const host = document.createElement('div');
  main.append(host);
  document.body.append(main);

  let api: ReturnType<typeof useVbenModal>[1] | undefined;
  let apiB: ReturnType<typeof useVbenModal>[1] | undefined;
  let deactivated = 0;
  // eslint-disable-next-line vue/one-component-per-file -- Cached pages and their modal children need separate instances.
  const DraftInput = defineComponent({
    setup() {
      // Keep this state inside the modal's child, so remounting would lose it.
      const draft = ref('');
      return () =>
        h('input', {
          'data-draft': 'A',
          value: draft.value,
          onInput: (event: Event) => {
            draft.value = (event.target as HTMLInputElement).value;
          },
        });
    },
  });
  // eslint-disable-next-line vue/one-component-per-file -- Exercise the connectedComponent API used by the playground.
  const ConnectedModal = defineComponent({
    setup() {
      const [Modal] = useVbenModal();
      return () => h(Modal, null, { default: () => h(DraftInput) });
    },
  });
  // eslint-disable-next-line vue/one-component-per-file -- The fixture needs two distinct cached pages.
  const PageA = defineComponent({
    name: 'Issue8403PageA',
    setup() {
      const [Modal, modalApi] = useVbenModal({
        appendToMain,
        destroyOnClose,
        title: 'Page A modal',
        ...callbacks,
        ...(connected ? { connectedComponent: ConnectedModal } : {}),
      });
      api = modalApi;
      onDeactivated(() => {
        deactivated += 1;
      });
      return () =>
        h('section', { 'data-page': 'A' }, [
          h(Modal, null, {
            default: () => h(DraftInput),
          }),
        ]);
    },
  });
  // eslint-disable-next-line vue/one-component-per-file -- The fixture needs two distinct cached pages.
  const PageB = defineComponent({
    name: 'Issue8403PageB',
    setup() {
      if (!pageBModal)
        return () => h('section', { 'data-page': 'B' }, 'Page B');
      const [Modal, modalApi] = useVbenModal({
        appendToMain: true,
        destroyOnClose: false,
        title: 'Page B modal',
      });
      apiB = modalApi;
      return () => h('section', { 'data-page': 'B' }, [h(Modal)]);
    },
  });
  const current = shallowRef(PageA);
  activeApp = createApp(() =>
    h(KeepAlive, null, { default: () => h(current.value) }),
  );
  activeApp.mount(host);
  await settle();
  if (!api) throw new Error('Modal API was not captured');
  if (openInitially) {
    api.open();
    await settle();
  }
  return {
    api,
    main,
    getDeactivated: () => deactivated,
    async openB() {
      if (!apiB) throw new Error('Page B modal API was not captured');
      apiB.open();
      await settle();
      return apiB;
    },
    async activate(page: 'A' | 'B') {
      current.value = page === 'A' ? PageA : PageB;
      await settle();
    },
  };
}

afterEach(() => {
  activeApp?.unmount();
  activeApp = undefined;
  document.body.innerHTML = '';
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('issue #8403: cached page modal visibility', () => {
  it('hides a content-area modal and its overlay when its cached page is inactive', async () => {
    const fixture = await mountCachedPages();
    expect(isDisplayed(document.querySelector('[role="dialog"]'))).toBe(true);
    await fixture.activate('B');
    expect(fixture.getDeactivated()).toBe(1);
    expect(fixture.main.querySelector('[data-page="B"]')).not.toBeNull();
    expect(fixture.main.querySelector('[data-page="A"]')).toBeNull();
    // Existing KeepAlive semantics require preserving the logical open state.
    expect(fixture.api.store.state.isOpen).toBe(true);
    expect
      .soft(isDisplayed(document.querySelector('[role="dialog"]')))
      .toBe(false);
    expect
      .soft(isDisplayed(document.querySelector('[data-dismissable-modal]')))
      .toBe(false);
  });

  it('preserves the draft when returning to the cached page', async () => {
    const fixture = await mountCachedPages();
    const input = getDraftInput();
    input.value = 'issue-8403-draft';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await settle();
    await fixture.activate('B');
    await fixture.activate('A');
    expect(fixture.api.store.state.isOpen).toBe(true);
    expect(isDisplayed(document.querySelector('[role="dialog"]'))).toBe(true);
    expect(
      document.querySelector<HTMLInputElement>('[data-draft="A"]')?.value,
    ).toBe('issue-8403-draft');
  });

  it('closes a body-mounted modal when its cached page is inactive', async () => {
    const fixture = await mountCachedPages({ appendToMain: false });
    await fixture.activate('B');
    expect(fixture.api.store.state.isOpen).toBe(false);
  });

  it('releases the scroll lock while inactive and restores it on return', async () => {
    const fixture = await mountCachedPages({ scrollable: true });
    expect(document.body.style.overflow).toBe('hidden');
    await fixture.activate('B');
    expect(document.body.style.overflow).not.toBe('hidden');
    await fixture.activate('A');
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('preserves child state on deactivation even when destroyOnClose is enabled', async () => {
    const fixture = await mountCachedPages({ destroyOnClose: true });
    const input = getDraftInput();
    input.value = 'cached child state';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await settle();
    await fixture.activate('B');
    await fixture.activate('A');
    expect(document.querySelector('[data-draft="A"]')).toBe(input);
    expect(input.value).toBe('cached child state');
    expect(isDisplayed(document.querySelector('[role="dialog"]'))).toBe(true);
  });

  it('does not close the inactive modal when Escape is pressed on another page', async () => {
    const fixture = await mountCachedPages();
    await fixture.activate('B');
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    await settle();
    expect(fixture.api.store.state.isOpen).toBe(true);
  });

  it('shows only the active page modal and directs Escape to that modal', async () => {
    const fixture = await mountCachedPages({
      pageBModal: true,
      scrollable: true,
    });
    const dialogA = document.querySelector('[role="dialog"]');
    await fixture.activate('B');
    const apiB = await fixture.openB();
    await fixture.activate('A');
    const dialogs = [...document.querySelectorAll('[role="dialog"]')];
    expect(dialogs.filter((dialog) => isDisplayed(dialog))).toEqual([dialogA]);
    expect(document.querySelectorAll('[data-dismissable-modal]')).toHaveLength(
      1,
    );
    expect(document.body.style.overflow).toBe('hidden');
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    await settle();
    expect(fixture.api.store.state.isOpen).toBe(false);
    expect(apiB.store.state.isOpen).toBe(true);
  });

  it('does not simulate modal open or close callbacks when switching cached pages', async () => {
    vi.useFakeTimers({
      toFake: [
        'cancelAnimationFrame',
        'clearTimeout',
        'requestAnimationFrame',
        'setTimeout',
      ],
    });
    const onBeforeClose = vi.fn();
    const onClosed = vi.fn();
    const onOpened = vi.fn();
    const onOpenChange = vi.fn();
    const fixture = await mountCachedPages({
      onBeforeClose,
      onClosed,
      onOpened,
      onOpenChange,
    });
    const dialog = getDialog();
    dialog.dispatchEvent(new Event('animationend'));
    await vi.advanceTimersByTimeAsync(32);
    expect(onOpened).toHaveBeenCalledTimes(1);
    await fixture.activate('B');
    await vi.advanceTimersByTimeAsync(400);
    await fixture.activate('A');
    dialog.dispatchEvent(new Event('animationend'));
    await vi.advanceTimersByTimeAsync(32);
    expect(onBeforeClose).not.toHaveBeenCalled();
    expect(onClosed).not.toHaveBeenCalled();
    expect(onOpened).toHaveBeenCalledTimes(1);
    expect(onOpenChange.mock.calls).toEqual([[true]]);
    expect(isDisplayed(dialog)).toBe(true);
  });

  it('completes a real API close while the page is already inactive', async () => {
    vi.useFakeTimers({ toFake: ['clearTimeout', 'setTimeout'] });
    const onClosed = vi.fn();
    const fixture = await mountCachedPages({ onClosed });
    await fixture.activate('B');
    await vi.advanceTimersByTimeAsync(400);
    await fixture.api.close();
    await settle();
    await vi.advanceTimersByTimeAsync(400);
    expect(onClosed).toHaveBeenCalledTimes(1);
    await fixture.activate('A');
    expect(fixture.api.store.state.isOpen).toBe(false);
    expect(isDisplayed(document.querySelector('[role="dialog"]'))).toBe(false);
  });

  it('does not mount unopened modal content when the page is deactivated', async () => {
    const fixture = await mountCachedPages({ openInitially: false });
    expect(document.querySelector('[data-draft="A"]')).toBeNull();
    await fixture.activate('B');
    expect(document.querySelector('[data-draft="A"]')).toBeNull();
    await fixture.activate('A');
    expect(document.querySelector('[data-draft="A"]')).toBeNull();
  });

  it('restores the same child of a connected modal after returning to its page', async () => {
    const fixture = await mountCachedPages({
      connected: true,
      destroyOnClose: true,
    });
    const input = getDraftInput();
    input.value = 'connected modal draft';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await settle();
    await fixture.activate('B');
    expect(isDisplayed(document.querySelector('[role="dialog"]'))).toBe(false);
    await fixture.activate('A');
    expect(document.querySelector('[data-draft="A"]')).toBe(input);
    expect(input.value).toBe('connected modal draft');
    expect(fixture.api.store.state.isOpen).toBe(true);
    expect(isDisplayed(document.querySelector('[role="dialog"]'))).toBe(true);
  });

  it('defers displaying an API-opened modal until its inactive page returns', async () => {
    const fixture = await mountCachedPages({ openInitially: false });
    await fixture.activate('B');
    fixture.api.open();
    await settle();
    expect(fixture.api.store.state.isOpen).toBe(true);
    expect(isDisplayed(document.querySelector('[role="dialog"]'))).toBe(false);
    expect(document.querySelector('[data-dismissable-modal]')).toBeNull();
    await fixture.activate('A');
    expect(isDisplayed(document.querySelector('[role="dialog"]'))).toBe(true);
  });
});
