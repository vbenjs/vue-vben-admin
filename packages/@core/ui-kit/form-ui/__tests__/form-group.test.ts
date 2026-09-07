import type { VueWrapper } from '@vue/test-utils';

import type { FormSchema } from '../src/types';

import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';

import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { z } from 'zod';

import { setupVbenForm } from '../src/config';
import { useVbenForm } from '../src/use-vben-form';

const wrappers: VueWrapper[] = [];

const TestInput = defineComponent({
  inheritAttrs: false,
  emits: ['update:modelValue'],
  setup(_props, { attrs, emit }) {
    return () =>
      h('input', {
        ...attrs,
        onInput: (event: Event) => {
          emit('update:modelValue', (event.target as HTMLInputElement).value);
        },
        value: attrs.modelValue ?? '',
      });
  },
});

beforeAll(() => {
  setupVbenForm({ config: {} });
});

afterEach(() => {
  for (const wrapper of wrappers.splice(0)) {
    wrapper.unmount();
  }
});

function createContactGroup(
  overrides: Partial<Extract<FormSchema, { type: 'group' }>> = {},
): FormSchema {
  return {
    children: [
      {
        component: TestInput,
        defaultValue: 'ada@example.com',
        fieldName: 'email',
        label: 'Email',
      },
      { component: TestInput, fieldName: 'phone', label: 'Phone' },
    ],
    name: 'contact',
    title: 'Contact',
    type: 'group',
    ...overrides,
  };
}

function getGroupState(wrapper: VueWrapper) {
  return wrapper.get('.form-group [data-state]').attributes('data-state');
}

describe('form group rendering', () => {
  it('renders grouped fields as regular form fields', async () => {
    const [Form, formApi] = useVbenForm({
      schema: [
        { component: TestInput, fieldName: 'name', label: 'Name' },
        createContactGroup({ extra: 'Optional' }),
      ],
    });
    const wrapper = mount(Form);
    wrappers.push(wrapper);
    await flushPromises();

    expect(wrapper.get('.form-group-title').text()).toBe('Contact');
    expect(wrapper.text()).toContain('Optional');
    expect(wrapper.findAll('input')).toHaveLength(3);
    expect(wrapper.get('.form-group').findAll('input')).toHaveLength(2);
    expect(getGroupState(wrapper)).toBe('open');
    expect(await formApi.getValues()).toEqual({ email: 'ada@example.com' });
  });

  it('toggles the group from its header and honors defaultCollapsed', async () => {
    const [Form] = useVbenForm({
      schema: [createContactGroup({ defaultCollapsed: true })],
    });
    const wrapper = mount(Form);
    wrappers.push(wrapper);
    await flushPromises();

    expect(getGroupState(wrapper)).toBe('closed');

    await wrapper.get('.form-group-header').trigger('click');
    expect(getGroupState(wrapper)).toBe('open');

    await wrapper.get('.form-group-header').trigger('click');
    expect(getGroupState(wrapper)).toBe('closed');
  });

  it('keeps a non-collapsible group open when the header is clicked', async () => {
    const [Form] = useVbenForm({
      schema: [createContactGroup({ collapsible: false })],
    });
    const wrapper = mount(Form);
    wrappers.push(wrapper);
    await flushPromises();

    await wrapper.get('.form-group-header').trigger('click');
    expect(getGroupState(wrapper)).toBe('open');
  });

  it('expands a collapsed group when one of its fields fails validation', async () => {
    const [Form, formApi] = useVbenForm({
      schema: [
        createContactGroup({
          children: [
            {
              component: TestInput,
              fieldName: 'email',
              label: 'Email',
              rules: z.string().min(1, 'Email is required'),
            },
          ],
          defaultCollapsed: true,
        }),
      ],
    });
    const wrapper = mount(Form);
    wrappers.push(wrapper);
    await flushPromises();

    expect(getGroupState(wrapper)).toBe('closed');

    expect(await formApi.validate()).toEqual({
      errors: { email: 'Email is required' },
      valid: false,
    });
    await flushPromises();

    expect(getGroupState(wrapper)).toBe('open');
    expect(wrapper.text()).toContain('Email is required');
  });

  it('skips hidden groups and forwards field slots into groups', async () => {
    const [Form] = useVbenForm({
      schema: [
        createContactGroup(),
        {
          children: [{ component: TestInput, fieldName: 'secret' }],
          hide: true,
          name: 'hidden',
          type: 'group',
        },
      ],
    });
    const wrapper = mount(Form, {
      slots: {
        phone: (slotProps: Record<string, any>) =>
          h(TestInput, {
            ...slotProps.componentProps,
            class: 'slot-phone',
          }),
      },
    });
    wrappers.push(wrapper);
    await flushPromises();

    expect(wrapper.findAll('.form-group')).toHaveLength(1);
    expect(wrapper.findAll('input')).toHaveLength(2);
    expect(wrapper.get('.form-group').find('.slot-phone').exists()).toBe(true);
  });

  it('re-renders grouped fields after updateSchema', async () => {
    const [Form, formApi] = useVbenForm({
      schema: [createContactGroup()],
    });
    const wrapper = mount(Form);
    wrappers.push(wrapper);
    await flushPromises();

    formApi.updateSchema([{ fieldName: 'phone', label: 'Mobile' }]);
    await flushPromises();

    expect(wrapper.text()).toContain('Mobile');
    expect(wrapper.text()).not.toContain('Phone');
  });
});
