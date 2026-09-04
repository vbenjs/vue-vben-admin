import type { ApiComponentProps } from '../types';

import { mount } from '@vue/test-utils';
import { defineComponent, h, markRaw, nextTick, ref } from 'vue';

import { describe, expect, it, vi } from 'vitest';

import ApiComponent from '../api-component.vue';

const ValueInput = defineComponent({
  name: 'ValueInput',
  props: {
    value: { type: String, default: undefined },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    return () =>
      h(
        'button',
        { onClick: () => emit('update:value', 'selected') },
        props.value,
      );
  },
});

const ModelValueInput = defineComponent({
  name: 'ModelValueInput',
  props: {
    modelValue: { type: String, default: undefined },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h(
        'button',
        { onClick: () => emit('update:modelValue', 'selected') },
        props.modelValue,
      );
  },
});

const KebabModelInput = defineComponent({
  name: 'KebabModelInput',
  props: {
    modelValue: { type: String, default: undefined },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h(
        'button',
        { onClick: () => emit('update:modelValue', 'selected') },
        props.modelValue,
      );
  },
});

describe('api-component.vue', () => {
  it('bridges a custom model prop in both directions', async () => {
    const outerValue = ref('initial');
    const handleUpdate = vi.fn((value: string) => {
      outerValue.value = value;
    });
    const Harness = defineComponent({
      setup() {
        return () =>
          h(ApiComponent, {
            component: markRaw(ValueInput),
            modelPropName: 'value',
            value: outerValue.value,
            'onUpdate:value': handleUpdate,
          });
      },
    });
    const wrapper = mount(Harness);
    const input = wrapper.findComponent(ValueInput);

    expect(input.props('value')).toBe('initial');

    await input.trigger('click');
    await nextTick();
    expect(handleUpdate).toHaveBeenCalledWith('selected');
    expect(input.props('value')).toBe('selected');

    outerValue.value = 'external';
    await nextTick();
    expect(input.props('value')).toBe('external');
  });

  it('preserves the default modelValue protocol', async () => {
    const wrapper = mount(ApiComponent, {
      props: {
        component: markRaw(ModelValueInput),
        modelValue: 'initial',
      },
    });
    const input = wrapper.findComponent(ModelValueInput);

    expect(input.props('modelValue')).toBe('initial');

    await input.trigger('click');
    await nextTick();
    expect(wrapper.emitted('update:modelValue')).toEqual([['selected']]);
    expect(input.props('modelValue')).toBe('selected');
  });

  it('bridges a kebab-case custom model prop', async () => {
    const outerValue = ref('initial');
    const handleUpdate = vi.fn((value: string) => {
      outerValue.value = value;
    });
    const Harness = defineComponent({
      setup() {
        return () =>
          h(ApiComponent, {
            component: markRaw(KebabModelInput),
            modelPropName: 'model-value',
            'model-value': outerValue.value,
            'onUpdate:model-value': handleUpdate,
          });
      },
    });
    const wrapper = mount(Harness);
    const input = wrapper.findComponent(KebabModelInput);

    expect(input.props('modelValue')).toBe('initial');

    await input.trigger('click');
    await nextTick();
    expect(handleUpdate).toHaveBeenCalledWith('selected');
    expect(input.props('modelValue')).toBe('selected');
  });

  it('fetches when the api is provided after mount', async () => {
    const api = vi
      .fn()
      .mockResolvedValue([{ label: 'Loaded', value: 'loaded' }]);
    const apiRef = ref<ApiComponentProps['api']>();
    const Harness = defineComponent({
      setup() {
        return () =>
          h(ApiComponent, {
            api: apiRef.value,
            component: markRaw(ModelValueInput),
          });
      },
    });

    const wrapper = mount(Harness);
    expect(api).not.toHaveBeenCalled();

    apiRef.value = api;
    await nextTick();

    expect(api).toHaveBeenCalledTimes(1);
    await vi.waitFor(() => {
      const events = wrapper
        .findComponent(ApiComponent)
        .emitted('optionsChange');
      const lastEvent = events?.at(-1)?.[0];
      expect(lastEvent).toEqual([
        expect.objectContaining({ label: 'Loaded', value: 'loaded' }),
      ]);
    });
  });
});
