import { DOMWrapper, mount } from '@vue/test-utils';
import { defineComponent, h, markRaw, nextTick, ref } from 'vue';

import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import IconPicker from '../icon-picker.vue';

// VbenIcon renders through @iconify/vue's Icon, which lazily fetches icon data
// from api.iconify.design at render time. Isolate it in tests: we only care
// about which icon names are rendered into the grid, not the SVG bodies.
vi.mock('@iconify/vue', () => ({
  Icon: defineComponent({
    name: 'IconifyIconMock',
    props: { icon: { type: String, default: '' } },
    setup() {
      return () => h('span', { class: 'mock-icon' });
    },
  }),
  addCollection: vi.fn(),
  addIcon: vi.fn(),
  listIcons: vi.fn(() => []),
}));

vi.mock('../icons', () => ({
  ICONS_MAP: {},
  fetchIconsData: vi.fn(async (prefix: string) =>
    prefix === 'carbon'
      ? [
          'carbon:home',
          'carbon:search',
          'carbon:settings',
          'carbon:user-profile',
        ]
      : [],
  ),
}));

// Belt and braces: log + block any remaining network access.
beforeAll(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: unknown) => {
      console.log('[icon-picker test] blocked fetch:', String(url));
      return new Response('{}', { status: 200 });
    }),
  );
});
afterEach(() => {
  document.body.innerHTML = '';
});

afterAll(() => {
  vi.unstubAllGlobals();
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const gridIconCount = () =>
  document.body.querySelector('.grid-cols-6')?.childElementCount ?? 0;

async function openIconPicker(wrapper: ReturnType<typeof mount>) {
  await wrapper.find('input').trigger('click');
  await nextTick();
  await vi.waitFor(() => {
    expect(document.body.querySelector('.grid-cols-6')).toBeTruthy();
  });
}

async function searchAndExpect(keyword: string, expectedCount: number) {
  const inputs = [...document.body.querySelectorAll('input')];
  const el = inputs.at(-1);
  if (!el) {
    throw new Error('search input not found in popover');
  }
  await new DOMWrapper(el).setValue(keyword);
  // keyword debounce is 300ms; waitFor polls until the grid settles.
  await vi.waitFor(() => {
    expect(gridIconCount()).toBe(expectedCount);
  });
}

// Mimics the antdv-next adapter registration:
//   IconPicker: withDefaultPlaceholder(IconPicker, 'select', {
//     iconSlot: 'addonAfter',
//     inputComponent: Input,
//     modelValueProp: 'value',
//   })
const AntdvNextLikeInput = defineComponent({
  name: 'AntdvNextLikeInput',
  props: {
    value: { type: String, default: '' },
  },
  emits: ['update:value'],
  setup(props, { emit, attrs }) {
    return () =>
      h('input', {
        ...attrs,
        class: ['antdv-next-like-input', attrs.class as string],
        value: props.value,
        onInput: (event: Event) => {
          const target = event.target as HTMLInputElement;
          emit('update:value', target.value);
        },
      });
  },
});

// Mimics the web-ele adapter registration:
//   IconPicker: withDefaultPlaceholder(IconPicker, 'select', {
//     iconSlot: 'append',
//     modelValueProp: 'model-value',
//     inputComponent: ElInput,
//   })
const ElementLikeInput = defineComponent({
  name: 'ElementLikeInput',
  props: {
    modelValue: { type: String, default: '' },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, attrs }) {
    return () =>
      h('input', {
        ...attrs,
        class: ['element-like-input', attrs.class as string],
        value: props.modelValue,
        onInput: (event: Event) => {
          const target = event.target as HTMLInputElement;
          emit('update:modelValue', target.value);
        },
      });
  },
});

const STATIC_ICONS = ['home', 'search', 'settings', 'user-profile'];

describe('icon-picker.vue', () => {
  it('filters icons with the search input (static icons)', async () => {
    const wrapper = mount(IconPicker, {
      attachTo: document.body,
      props: {
        icons: STATIC_ICONS,
        prefix: '',
      },
    });
    await openIconPicker(wrapper);
    expect(gridIconCount()).toBe(4);

    // 'ho' matches only 'home'
    await searchAndExpect('ho', 1);

    await searchAndExpect('zzz', 0); // empty result

    wrapper.unmount();
  });

  it('filters icons with the search input (prefix + fetched icons)', async () => {
    const wrapper = mount(IconPicker, {
      attachTo: document.body,
      props: {
        prefix: 'carbon',
      },
    });
    // watchDebounced: immediate + 500ms debounce before fetchIconsData
    await sleep(700);
    await openIconPicker(wrapper);
    expect(gridIconCount()).toBe(4);

    // 'user' matches only 'carbon:user-profile'
    await searchAndExpect('user', 1);

    wrapper.unmount();
  });

  it('filters icons through inputComponent using the value/onUpdate:value protocol', async () => {
    const wrapper = mount(IconPicker, {
      attachTo: document.body,
      props: {
        icons: STATIC_ICONS,
        inputComponent: markRaw(AntdvNextLikeInput),
        modelValueProp: 'value',
        prefix: '',
      },
    });
    await openIconPicker(wrapper);
    expect(gridIconCount()).toBe(4);

    // 'se' matches 'search', 'settings' and 'user-profile' (u-s-e-r)
    await searchAndExpect('se', 3);

    await searchAndExpect('zzz', 0);

    wrapper.unmount();
  });

  it('updates the model value when selecting an icon (value input protocol)', async () => {
    const onUpdateModelValue = vi.fn();
    const wrapper = mount(IconPicker, {
      attachTo: document.body,
      props: {
        icons: STATIC_ICONS,
        inputComponent: markRaw(AntdvNextLikeInput),
        modelValueProp: 'value',
        modelValue: 'settings',
        prefix: '',
        'onUpdate:modelValue': onUpdateModelValue,
      },
    });
    await openIconPicker(wrapper);

    const firstIcon = document.body.querySelector('.grid-cols-6 > button');
    expect(firstIcon).toBeTruthy();
    await new DOMWrapper(firstIcon as Element).trigger('click');

    expect(onUpdateModelValue).toHaveBeenCalledWith('home');
    expect(wrapper.find('input').element.value).toBe('home');

    wrapper.unmount();
  });

  it('round-trips selection through the modelValue protocol with a value-protocol input', async () => {
    // Mimics the web-antd form binding after mapping IconPicker to
    // `modelValue` via modelPropNameMap: the form holds the state and feeds
    // it back through v-model, while the trigger input still speaks the
    // value/onUpdate:value protocol.
    const host = mount(
      defineComponent({
        name: 'ValueProtocolHost',
        setup() {
          const modelValue = ref('settings');
          return () =>
            h(IconPicker, {
              icons: STATIC_ICONS,
              inputComponent: markRaw(AntdvNextLikeInput),
              modelValueProp: 'value',
              modelValue: modelValue.value,
              prefix: '',
              'onUpdate:modelValue': (v: string) => {
                modelValue.value = v;
              },
            });
        },
      }),
      { attachTo: document.body },
    );
    await nextTick();
    expect(host.find('input').element.value).toBe('settings');

    await openIconPicker(host);
    const firstIcon = document.body.querySelector('.grid-cols-6 > button');
    expect(firstIcon).toBeTruthy();
    await new DOMWrapper(firstIcon as Element).trigger('click');

    expect(host.find('input').element.value).toBe('home');

    host.unmount();
  });

  it('ignores stray value attrs in favor of the v-model contract', async () => {
    // The outer contract is always v-model: a `value` attr leaking in from
    // a legacy adapter config must not override the trigger input binding.
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const wrapper = mount(IconPicker, {
      attachTo: document.body,
      props: {
        icons: STATIC_ICONS,
        inputComponent: markRaw(AntdvNextLikeInput),
        modelValueProp: 'value',
        modelValue: 'home',
        prefix: '',
        value: 'stray',
      },
    });
    await nextTick();
    expect(wrapper.find('input').element.value).toBe('home');

    // legacy bindings are dropped with a one-time migration warning
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0]?.[0]).toContain('modelPropNameMap');

    warn.mockRestore();
    wrapper.unmount();
  });

  it('syncs the initial and external modelValue with a kebab-case modelValueProp', async () => {
    const wrapper = mount(IconPicker, {
      attachTo: document.body,
      props: {
        icons: STATIC_ICONS,
        inputComponent: markRaw(ElementLikeInput),
        modelValue: 'home',
        modelValueProp: 'model-value',
        prefix: '',
      },
    });
    await nextTick();
    expect(wrapper.find('input').element.value).toBe('home');

    // external update
    await wrapper.setProps({ modelValue: 'settings' });
    await nextTick();
    expect(wrapper.find('input').element.value).toBe('settings');

    wrapper.unmount();
  });

  it('keeps manual input with a kebab-case modelValueProp', async () => {
    // The parent feeds the emitted value back through modelValue, so the
    // typed text must survive the parent rerender.
    const onUpdateModelValue = vi.fn();
    const host = mount(
      defineComponent({
        name: 'KebabModelHost',
        setup() {
          const modelValue = ref('home');
          return () =>
            h(IconPicker, {
              icons: STATIC_ICONS,
              inputComponent: markRaw(ElementLikeInput),
              modelValue: modelValue.value,
              modelValueProp: 'model-value',
              prefix: '',
              'onUpdate:modelValue': (v: string) => {
                onUpdateModelValue(v);
                modelValue.value = v;
              },
            });
        },
      }),
      { attachTo: document.body },
    );
    const input = host.find('input');
    await input.setValue('search');

    expect(onUpdateModelValue).toHaveBeenCalledWith('search');
    expect(input.element.value).toBe('search');

    host.unmount();
  });

  it('updates the model value and trigger input when selecting an icon (kebab-case modelValueProp)', async () => {
    const onUpdateModelValue = vi.fn();
    const wrapper = mount(IconPicker, {
      attachTo: document.body,
      props: {
        icons: STATIC_ICONS,
        inputComponent: markRaw(ElementLikeInput),
        modelValue: 'settings',
        modelValueProp: 'model-value',
        prefix: '',
        'onUpdate:modelValue': onUpdateModelValue,
      },
    });
    await openIconPicker(wrapper);

    const firstIcon = document.body.querySelector('.grid-cols-6 > button');
    expect(firstIcon).toBeTruthy();
    await new DOMWrapper(firstIcon as Element).trigger('click');

    expect(onUpdateModelValue).toHaveBeenCalledWith('home');
    expect(wrapper.find('input').element.value).toBe('home');

    wrapper.unmount();
  });

  it('invokes a kebab-case model listener exactly once per selection', async () => {
    // defineModel's `update:modelValue` emit already reaches kebab-case
    // listeners through Vue's fallback; nothing may invoke it a second time.
    const onKebabUpdate = vi.fn();
    const wrapper = mount(IconPicker, {
      attachTo: document.body,
      props: {
        icons: STATIC_ICONS,
        inputComponent: markRaw(ElementLikeInput),
        modelValueProp: 'model-value',
        prefix: '',
        'onUpdate:model-value': onKebabUpdate,
      },
    });
    await openIconPicker(wrapper);

    const firstIcon = document.body.querySelector('.grid-cols-6 > button');
    expect(firstIcon).toBeTruthy();
    await new DOMWrapper(firstIcon as Element).trigger('click');

    expect(onKebabUpdate).toHaveBeenCalledTimes(1);
    expect(onKebabUpdate).toHaveBeenCalledWith('home');

    wrapper.unmount();
  });
});
