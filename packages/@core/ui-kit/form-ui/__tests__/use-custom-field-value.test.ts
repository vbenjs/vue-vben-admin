import type { VueWrapper } from '@vue/test-utils';
import type { PropType } from 'vue';

import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h, reactive, ref } from 'vue';

import { afterEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { useCustomFieldValue } from '../src/use-custom-field-value';
import { useVbenForm } from '../src/use-vben-form';

const wrappers: VueWrapper[] = [];

// 字段的组件由插槽接管，schema 上只需要一个占位组件
const Placeholder = () => h('span');

// 内部维护选中项、不接收 modelValue 的复合组件
const TagPicker = defineComponent({
  props: {
    immediate: { default: false, type: Boolean },
  },
  setup(props) {
    const tags = ref<string[]>([]);
    const { disabled, error, fieldName, value } = useCustomFieldValue(
      () => [...tags.value],
      { immediate: props.immediate },
    );

    return () =>
      h(
        'button',
        {
          class: 'tag-picker',
          'data-disabled': String(disabled.value),
          'data-error': error.value ?? '',
          'data-field-name': fieldName ?? '',
          'data-value': JSON.stringify(value.value ?? null),
          onClick: () => {
            tags.value = [...tags.value, `tag-${tags.value.length}`];
          },
        },
        'add',
      );
  },
});

// 原地修改同一个数组的复合组件，只有 deep 才能感知到变化
const DeepTagPicker = defineComponent({
  setup() {
    const tags = reactive<string[]>([]);
    const { error, value } = useCustomFieldValue(() => tags, { deep: true });

    return () =>
      h(
        'button',
        {
          class: 'tag-picker',
          'data-error': error.value ?? '',
          'data-value': JSON.stringify(value.value ?? null),
          onClick: () => {
            tags.push(`tag-${tags.length}`);
          },
        },
        'add',
      );
  },
});

// 值由表单通过 modelValue 下发的复合组件，取值函数只服务于校验
const BoundTagPicker = defineComponent({
  props: {
    modelValue: { default: () => [], type: Array as PropType<string[]> },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { error, value } = useCustomFieldValue(() => props.modelValue);

    return () =>
      h(
        'button',
        {
          class: 'tag-picker',
          'data-error': error.value ?? '',
          'data-value': JSON.stringify(value.value ?? null),
          onClick: () => {
            emit('update:modelValue', [
              ...props.modelValue,
              `tag-${props.modelValue.length}`,
            ]);
          },
        },
        'add',
      );
  },
});

function mountTagForm(
  options: {
    formFieldProps?: Record<string, any>;
    immediate?: boolean;
  } = {},
) {
  const [Form, formApi] = useVbenForm({
    schema: [
      {
        component: Placeholder,
        defaultValue: [],
        fieldName: 'tags',
        formFieldProps: options.formFieldProps,
        label: 'Tags',
        rules: z.array(z.string()).max(1, 'Too many tags'),
      },
    ],
  });
  const wrapper = mount(Form, {
    slots: {
      tags: () => h(TagPicker, { immediate: options.immediate ?? false }),
    },
  });
  wrappers.push(wrapper);
  return { formApi, wrapper };
}

function mountDeepTagForm() {
  const [Form, formApi] = useVbenForm({
    schema: [
      {
        component: Placeholder,
        defaultValue: [],
        fieldName: 'tags',
        label: 'Tags',
        rules: z.array(z.string()).max(1, 'Too many tags'),
      },
    ],
  });
  const wrapper = mount(Form, {
    slots: {
      tags: () => h(DeepTagPicker),
    },
  });
  wrappers.push(wrapper);
  return { formApi, wrapper };
}

function mountBoundTagForm() {
  const [Form, formApi] = useVbenForm({
    schema: [
      {
        component: Placeholder,
        defaultValue: [],
        fieldName: 'tags',
        label: 'Tags',
        rules: z.array(z.string()).min(1, 'Pick at least one tag'),
      },
    ],
  });
  const wrapper = mount(Form, {
    slots: {
      tags: (slotProps: any) => h(BoundTagPicker, slotProps.componentProps),
    },
  });
  wrappers.push(wrapper);
  return { formApi, wrapper };
}

afterEach(() => {
  for (const wrapper of wrappers.splice(0)) {
    wrapper.unmount();
  }
  vi.restoreAllMocks();
});

describe('useCustomFieldValue', () => {
  it('writes the custom value into the form and validates on change', async () => {
    const { formApi, wrapper } = mountTagForm();
    await flushPromises();

    await wrapper.get('.tag-picker').trigger('click');
    await flushPromises();

    expect(await formApi.getValues()).toEqual({ tags: ['tag-0'] });
    expect(formApi.form.getFieldError('tags')).toBeUndefined();

    await wrapper.get('.tag-picker').trigger('click');
    await flushPromises();

    expect(await formApi.getValues()).toEqual({ tags: ['tag-0', 'tag-1'] });
    expect(formApi.form.getFieldError('tags')).toBe('Too many tags');
  });

  it('validates every in-place mutation when deep is enabled', async () => {
    const { formApi, wrapper } = mountDeepTagForm();
    await flushPromises();

    await wrapper.get('.tag-picker').trigger('click');
    await flushPromises();

    expect(await formApi.getValues()).toEqual({ tags: ['tag-0'] });
    expect(formApi.form.getFieldError('tags')).toBeUndefined();

    await wrapper.get('.tag-picker').trigger('click');
    await flushPromises();

    expect(await formApi.getValues()).toEqual({ tags: ['tag-0', 'tag-1'] });
    expect(formApi.form.getFieldError('tags')).toBe('Too many tags');
  });

  it('exposes the field state to the custom component', async () => {
    const { formApi, wrapper } = mountTagForm();
    await flushPromises();

    const picker = wrapper.get('.tag-picker');
    expect(picker.attributes('data-field-name')).toBe('tags');
    expect(picker.attributes('data-disabled')).toBe('false');

    await formApi.setFieldValue('tags', ['from-form']);
    await flushPromises();

    expect(picker.attributes('data-value')).toBe('["from-form"]');
  });

  it('lets reset flow back into a form-driven component without validating', async () => {
    const { formApi, wrapper } = mountBoundTagForm();
    await flushPromises();

    await wrapper.get('.tag-picker').trigger('click');
    await flushPromises();

    expect(await formApi.getValues()).toEqual({ tags: ['tag-0'] });
    expect(wrapper.get('.tag-picker').attributes('data-value')).toBe(
      '["tag-0"]',
    );

    await formApi.reset();
    await flushPromises();

    expect(await formApi.getValues()).toEqual({ tags: [] });
    expect(wrapper.get('.tag-picker').attributes('data-value')).toBe('[]');
    expect(formApi.form.getFieldError('tags')).toBeUndefined();
  });

  it('respects validateOn and skips validation on change', async () => {
    const { formApi, wrapper } = mountTagForm({
      formFieldProps: { validateOn: [] },
    });
    await flushPromises();

    await wrapper.get('.tag-picker').trigger('click');
    await wrapper.get('.tag-picker').trigger('click');
    await flushPromises();

    expect(formApi.form.getFieldError('tags')).toBeUndefined();
    expect(await formApi.validate()).toEqual({
      errors: { tags: 'Too many tags' },
      valid: false,
    });
  });

  it('writes the initial value on mount when immediate is enabled', async () => {
    const { formApi } = mountTagForm({ immediate: true });
    await flushPromises();

    expect(await formApi.getValues()).toEqual({ tags: [] });
    expect(formApi.form.getFieldError('tags')).toBeUndefined();
  });

  it('keeps the first getter when a field registers twice', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const [Form] = useVbenForm({
      schema: [
        {
          component: Placeholder,
          defaultValue: [],
          fieldName: 'tags',
        },
      ],
    });
    const wrapper = mount(Form, {
      slots: {
        tags: () => [h(TagPicker), h(TagPicker)],
      },
    });
    wrappers.push(wrapper);
    await flushPromises();

    expect(warn).toHaveBeenCalledWith(
      '表单项 tags 已存在自定义取值函数，本次注册被忽略',
    );
  });

  it('warns when used outside a form field', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const wrapper = mount(TagPicker);
    wrappers.push(wrapper);
    await flushPromises();

    expect(warn).toHaveBeenCalledWith(
      'useCustomFieldValue 只能在 VbenForm 的表单项内部使用',
    );
    expect(wrapper.get('.tag-picker').attributes('data-field-name')).toBe('');
  });
});
