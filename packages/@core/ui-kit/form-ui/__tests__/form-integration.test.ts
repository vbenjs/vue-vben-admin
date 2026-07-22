import type { VueWrapper } from '@vue/test-utils';

import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';

import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { setupVbenForm } from '../src/config';
import { useVbenForm } from '../src/use-vben-form';

const wrappers: VueWrapper[] = [];

const TestInput = defineComponent({
  inheritAttrs: false,
  props: {
    eventMode: {
      default: 'model-value',
      type: String,
    },
  },
  emits: ['change', 'update:modelValue', 'update:value'],
  setup(props, { attrs, emit }) {
    function handleInput(event: Event) {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) {
        return;
      }
      if (props.eventMode === 'change-only') {
        emit('change', event);
        return;
      }
      if (props.eventMode === 'value-and-change') {
        emit('update:value', target.value);
        emit('change', event);
        return;
      }
      emit('update:modelValue', target.value);
    }

    return () =>
      h('input', {
        ...attrs,
        onInput: handleInput,
        value: attrs.modelValue ?? '',
      });
  },
});

beforeAll(() => {
  setupVbenForm({
    config: {},
    rules: {
      required(value, _params, context) {
        return value ? true : `${context.label} is required`;
      },
    },
  });
});

afterEach(() => {
  for (const wrapper of wrappers.splice(0)) {
    wrapper.unmount();
  }
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('useVbenForm integration', () => {
  it('uses model updates as the primary channel and preserves empty strings', async () => {
    const validateValue = vi.fn();
    const [Form, formApi] = useVbenForm({
      schema: [
        {
          component: TestInput,
          componentProps: { eventMode: 'value-and-change' },
          defaultValue: 'initial',
          fieldName: 'name',
          modelPropName: 'value',
          rules: z.string().superRefine((value) => validateValue(value)),
        },
      ],
    });
    const wrapper = mount(Form);
    wrappers.push(wrapper);
    await flushPromises();
    const initialValidationCount = validateValue.mock.calls.length;

    await wrapper.get('input').setValue('');
    await flushPromises();

    expect(await formApi.getValues()).toEqual({ name: '' });
    expect(validateValue).toHaveBeenCalledTimes(initialValidationCount + 1);
  });

  it('supports a field-level change event fallback for legacy components', async () => {
    const [Form, formApi] = useVbenForm({
      schema: [
        {
          component: TestInput,
          componentProps: { eventMode: 'change-only' },
          disabledOnChangeListener: false,
          fieldName: 'name',
          modelPropName: 'value',
        },
      ],
    });
    const wrapper = mount(Form);
    wrappers.push(wrapper);
    await flushPromises();

    await wrapper.get('input').setValue('fallback');
    await flushPromises();

    expect(await formApi.getValues()).toEqual({ name: 'fallback' });
  });

  it('binds fields, renders accessible errors, and submits valid values', async () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const handleSubmit = vi.fn();
    const [Form, formApi] = useVbenForm({
      handleSubmit,
      schema: [
        {
          component: TestInput,
          fieldName: 'name',
          label: 'Name',
          rules: z.string().min(1, 'Name is required'),
        },
        {
          component: TestInput,
          fieldName: 'alias',
          label: 'Alias',
          rules: 'required',
        },
      ],
    });
    const wrapper = mount(Form, { attachTo: document.body });
    wrappers.push(wrapper);
    await flushPromises();

    expect(await formApi.validate()).toEqual({
      errors: {
        alias: 'Alias is required',
        name: 'Name is required',
      },
      valid: false,
    });
    await flushPromises();

    const inputs = wrapper.findAll('input');
    expect(inputs).toHaveLength(2);
    expect(inputs[0]?.attributes('aria-invalid')).toBe('true');
    expect(wrapper.text()).toContain('Name is required');
    expect(wrapper.text()).toContain('Alias is required');

    await inputs[0]?.setValue('Ada');
    await formApi.setFieldValue('alias', 'Countess', true);
    await flushPromises();
    expect(wrapper.text()).not.toContain('Name is required');

    expect(await formApi.validateField('name')).toEqual({
      errors: {},
      valid: true,
    });
    expect(await formApi.validateAndSubmit()).toEqual({
      alias: 'Countess',
      name: 'Ada',
    });
    expect(handleSubmit).toHaveBeenCalledOnce();
    expect(handleSubmit).toHaveBeenCalledWith({
      alias: 'Countess',
      name: 'Ada',
    });
    expect(consoleError).not.toHaveBeenCalled();
  });

  it('recomputes dependencies only from declared trigger fields', async () => {
    const dependency = vi.fn((values: Record<string, any>) => {
      return values.toggle === 'show';
    });
    const [Form, formApi] = useVbenForm({
      schema: [
        {
          component: TestInput,
          fieldName: 'toggle',
          label: 'Toggle',
        },
        {
          component: TestInput,
          dependencies: {
            if: dependency,
            triggerFields: ['toggle'],
          },
          fieldName: 'details',
          label: 'Details',
        },
      ],
    });
    const wrapper = mount(Form);
    wrappers.push(wrapper);
    await flushPromises();

    expect(wrapper.find('input[name="details"]').exists()).toBe(false);
    const initialCalls = dependency.mock.calls.length;

    await formApi.setFieldValue('unrelated', 'value');
    await flushPromises();
    expect(dependency).toHaveBeenCalledTimes(initialCalls);

    await formApi.setFieldValue('toggle', 'show');
    await flushPromises();
    expect(wrapper.find('input[name="details"]').exists()).toBe(true);
    expect(dependency.mock.calls.length).toBeGreaterThan(initialCalls);
  });

  it('applies required rules enabled by dependencies after mount', async () => {
    const [Form, formApi] = useVbenForm({
      schema: [
        {
          component: TestInput,
          fieldName: 'toggle',
          label: 'Toggle',
        },
        {
          component: TestInput,
          dependencies: {
            required(values) {
              return values.toggle === true;
            },
            triggerFields: ['toggle'],
          },
          fieldName: 'details',
          label: 'Details',
        },
      ],
    });
    const wrapper = mount(Form);
    wrappers.push(wrapper);
    await flushPromises();

    expect(await formApi.validate()).toEqual({ errors: {}, valid: true });

    await formApi.setFieldValue('toggle', true);
    await flushPromises();
    expect(await formApi.validate()).toEqual({
      errors: { details: 'Details is required' },
      valid: false,
    });

    await formApi.setFieldValue('details', 'ready');
    expect(await formApi.validate()).toEqual({ errors: {}, valid: true });
  });

  it('keeps array values and rendered rows aligned after mutations', async () => {
    const [Form, formApi] = useVbenForm({
      schema: [
        {
          children: [
            {
              component: TestInput,
              fieldName: 'name',
              label: 'Name',
              rules: z.string().min(1, 'Name is required'),
            },
          ],
          defaultValue: [{ name: 'Ada' }],
          fieldName: 'contacts',
          type: 'array',
        },
      ],
    });
    const wrapper = mount(Form);
    wrappers.push(wrapper);
    await flushPromises();

    expect(wrapper.findAll('input')).toHaveLength(1);
    formApi.form.pushFieldValue('contacts', { name: 'Grace' });
    await flushPromises();
    expect(wrapper.findAll('input')).toHaveLength(2);
    expect(await formApi.getValues()).toEqual({
      contacts: [{ name: 'Ada' }, { name: 'Grace' }],
    });

    await formApi.form.removeFieldValue('contacts', 0);
    await flushPromises();
    expect(wrapper.findAll('input')).toHaveLength(1);
    expect(await formApi.getValues()).toEqual({
      contacts: [{ name: 'Grace' }],
    });
  });

  it('reports changed fields and submits valid changes', async () => {
    vi.useFakeTimers();
    const handleSubmit = vi.fn();
    const handleValuesChange = vi.fn();
    const [Form, formApi] = useVbenForm({
      changeDebouncedTime: 0,
      handleSubmit,
      handleValuesChange,
      schema: [
        {
          component: TestInput,
          fieldName: 'name',
          label: 'Name',
          rules: z.string().min(1, 'Name is required'),
        },
      ],
      submitOnChange: true,
    });
    const wrapper = mount(Form);
    wrappers.push(wrapper);
    await flushPromises();

    await formApi.setFieldValue('name', 'Ada');
    await nextTick();
    await vi.runAllTimersAsync();
    await flushPromises();

    expect(handleValuesChange).toHaveBeenCalledWith({ name: 'Ada' }, ['name']);
    expect(handleSubmit).toHaveBeenCalledWith({ name: 'Ada' });
  });

  it('respects blur and change validation triggers', async () => {
    const [Form] = useVbenForm({
      schema: [
        {
          component: TestInput,
          defaultValue: 'valid',
          fieldName: 'name',
          formFieldProps: {
            validateOnBlur: true,
            validateOnChange: false,
            validateOnModelUpdate: false,
          },
          label: 'Name',
          rules: z.string().min(1, 'Name is required'),
        },
      ],
    });
    const wrapper = mount(Form);
    wrappers.push(wrapper);
    await flushPromises();
    const input = wrapper.get('input');

    await input.setValue('');
    await flushPromises();
    expect(wrapper.text()).not.toContain('Name is required');

    await input.trigger('blur');
    await flushPromises();
    expect(wrapper.text()).toContain('Name is required');

    await input.setValue('Ada');
    await flushPromises();
    expect(wrapper.text()).not.toContain('Name is required');

    await input.trigger('blur');
    await flushPromises();
    expect(wrapper.text()).not.toContain('Name is required');
  });

  it('ignores stale asynchronous validation results', async () => {
    let resolveTaken: (() => void) | undefined;
    const usernameRule = z.string().refine(async (value) => {
      if (value === 'taken') {
        await new Promise<void>((resolve) => {
          resolveTaken = resolve;
        });
      }
      return value !== 'taken';
    }, 'Username is already taken');
    const [Form, formApi] = useVbenForm({
      schema: [
        {
          component: TestInput,
          fieldName: 'username',
          label: 'Username',
          rules: usernameRule,
        },
      ],
    });
    const wrapper = mount(Form);
    wrappers.push(wrapper);
    await flushPromises();
    const input = wrapper.get('input');

    await input.setValue('taken');
    await vi.waitFor(() => {
      expect(resolveTaken).toBeDefined();
    });
    if (!resolveTaken) return;

    await input.setValue('available');
    await flushPromises();
    resolveTaken();
    await flushPromises();

    expect(formApi.form.getFieldError('username')).toBeUndefined();
  });
});
