import type { VueWrapper } from '@vue/test-utils';

import type { FormSchemaRuleType } from '../src/types';

import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';

import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { setupVbenForm } from '../src/config';
import { resetDeprecationWarnings } from '../src/deprecation';
import { useVbenForm } from '../src/use-vben-form';

const wrappers: VueWrapper[] = [];

function createDeferred<T>() {
  let resolvePromise: (value: T) => void = () => {};
  const promise = new Promise<T>((resolve) => {
    resolvePromise = resolve;
  });
  return { promise, resolve: resolvePromise };
}

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
          changeEventFallback: true,
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

  it('warns once for legacy dependency callbacks', async () => {
    resetDeprecationWarnings();
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const [Form] = useVbenForm({
      schema: [
        {
          component: TestInput,
          dependencies: {
            show: true,
            triggerFields: ['toggle'],
          },
          fieldName: 'first',
        },
        {
          component: TestInput,
          dependencies: {
            disabled: false,
            triggerFields: ['toggle'],
          },
          fieldName: 'second',
        },
      ],
    });
    const wrapper = mount(Form);
    wrappers.push(wrapper);
    await flushPromises();

    expect(warning).toHaveBeenCalledOnce();
    expect(warning).toHaveBeenCalledWith(
      '[Vben Form] Legacy dependency callbacks are deprecated. Use `dependencies.resolve(context)` instead.',
    );
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
          valueFormat: (value) => value.trim(),
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
    expect(handleSubmit).toHaveBeenCalledWith(
      {
        alias: 'Countess',
        name: 'Ada',
      },
      {
        alias: 'Countess',
        name: 'Ada',
      },
    );
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

  it('resolves dependency patches atomically from declared fields', async () => {
    const pendingPatch = createDeferred<{
      componentProps: { placeholder: string };
      if: boolean;
    }>();
    const resolve = vi.fn(({ values }: { values: Record<string, any> }) => {
      if (values.toggle === 'pending') {
        return pendingPatch.promise;
      }
      return {
        componentProps: { placeholder: 'initial' },
        if: false,
      };
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
            resolve,
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
    const initialCalls = resolve.mock.calls.length;

    await formApi.setFieldValue('unrelated', 'value');
    await flushPromises();
    expect(resolve).toHaveBeenCalledTimes(initialCalls);

    await formApi.setFieldValue('toggle', 'pending');
    await flushPromises();
    expect(wrapper.find('input[name="details"]').exists()).toBe(false);

    pendingPatch.resolve({
      componentProps: { placeholder: 'resolved' },
      if: true,
    });
    await flushPromises();

    const details = wrapper.find('input[name="details"]');
    expect(details.exists()).toBe(true);
    expect(details.attributes('placeholder')).toBe('resolved');
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

  it('allows dependencies to disable static rules with null', async () => {
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
            rules(values) {
              return values.toggle === true
                ? z.string().min(1, 'Details is required')
                : null;
            },
            triggerFields: ['toggle'],
          },
          fieldName: 'details',
          label: 'Details',
          rules: z.string().min(1, 'Static details rule'),
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
  });

  it('ignores stale async dependency rule results', async () => {
    const requiredRules = createDeferred<FormSchemaRuleType>();
    const optionalRules = createDeferred<FormSchemaRuleType>();
    const [Form, formApi] = useVbenForm({
      schema: [
        {
          component: TestInput,
          fieldName: 'mode',
          label: 'Mode',
        },
        {
          component: TestInput,
          dependencies: {
            rules(values) {
              if (values.mode === 'required') {
                return requiredRules.promise;
              }
              if (values.mode === 'optional') {
                return optionalRules.promise;
              }
              return null;
            },
            triggerFields: ['mode'],
          },
          fieldName: 'details',
          label: 'Details',
        },
      ],
    });
    const wrapper = mount(Form);
    wrappers.push(wrapper);
    await flushPromises();

    await formApi.setFieldValue('mode', 'required');
    await flushPromises();
    await formApi.setFieldValue('mode', 'optional');
    await flushPromises();

    optionalRules.resolve(null);
    await flushPromises();
    requiredRules.resolve(z.string().min(1, 'Stale required rule'));
    await flushPromises();

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

  it('scopes resolve dependencies to array rows', async () => {
    const resolve = vi.fn(({ schema }: Record<string, any>) => ({
      componentProps: {
        disabled: schema.row?.role === 'viewer',
      },
    }));
    const [Form] = useVbenForm({
      schema: [
        {
          children: [
            {
              component: TestInput,
              fieldName: 'role',
              label: 'Role',
            },
            {
              component: TestInput,
              dependencies: {
                resolve,
                triggerFields: ['role'],
              },
              fieldName: 'phone',
              label: 'Phone',
            },
          ],
          defaultValue: [{ phone: '', role: 'viewer' }],
          fieldName: 'contacts',
          type: 'array',
        },
      ],
    });
    const wrapper = mount(Form);
    wrappers.push(wrapper);
    await flushPromises();

    expect(resolve).toHaveBeenCalledWith(
      expect.objectContaining({
        schema: expect.objectContaining({
          fieldName: 'contacts[0].phone',
          row: { phone: '', role: 'viewer' },
          rowIndex: 0,
          rowPath: 'contacts[0]',
        }),
      }),
    );
    expect(
      wrapper.get('input[name="contacts[0].phone"]').attributes('disabled'),
    ).toBeDefined();
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
          valueFormat: (value) => value.trim(),
        },
      ],
      submitOnChange: true,
    });
    const wrapper = mount(Form);
    wrappers.push(wrapper);
    await flushPromises();

    await formApi.setFieldValue('name', ' Ada ');
    await nextTick();
    await vi.runAllTimersAsync();
    await flushPromises();

    expect(handleValuesChange).toHaveBeenCalledWith(
      { name: ' Ada ' },
      ['name'],
      expect.any(Function),
    );
    const valuesChangeCall = handleValuesChange.mock.calls.at(0);
    expect(valuesChangeCall).toBeDefined();
    if (!valuesChangeCall) return;
    expect(valuesChangeCall[2]()).toEqual({ name: 'Ada' });
    expect(handleSubmit).toHaveBeenCalledWith(
      { name: 'Ada' },
      { name: ' Ada ' },
    );
  });

  it('respects blur and change validation triggers', async () => {
    const [Form] = useVbenForm({
      schema: [
        {
          component: TestInput,
          defaultValue: 'valid',
          fieldName: 'name',
          formFieldProps: {
            validateOn: ['blur'],
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
    await vi.waitFor(() => {
      expect(wrapper.text()).not.toContain('Name is required');
    });

    await input.trigger('blur');
    // The blur validator (`onBlurAsync`) resolves across several microtasks,
    // so poll until the error state settles instead of a single flushPromises.
    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('Name is required');
    });

    await input.setValue('Ada');
    await flushPromises();
    await vi.waitFor(() => {
      expect(wrapper.text()).not.toContain('Name is required');
    });

    await input.trigger('blur');
    await flushPromises();
    await vi.waitFor(() => {
      expect(wrapper.text()).not.toContain('Name is required');
    });
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

  it('passes formatted values and raw values to handleSubmit callback', async () => {
    const handleSubmit = vi.fn();
    const [Form, formApi] = useVbenForm({
      handleSubmit,
      schema: [
        {
          component: TestInput,
          fieldName: 'name',
          rules: 'required',
          valueFormat: (value) => (value ? value.toUpperCase() : value),
        },
      ],
    });
    const wrapper = mount(Form);
    wrappers.push(wrapper);
    await flushPromises();

    await formApi.setFieldValue('name', 'test');
    await formApi.validateAndSubmit();
    await flushPromises();

    expect(handleSubmit).toHaveBeenCalledOnce();
    expect(handleSubmit).toHaveBeenCalledWith(
      { name: 'TEST' },
      { name: 'test' },
    );
  });

  it('calls handleReset with formatted values on reset button click', async () => {
    const handleReset = vi.fn();
    const [Form, formApi] = useVbenForm({
      handleReset,
      schema: [
        {
          component: TestInput,
          defaultValue: 'hello',
          fieldName: 'name',
          valueFormat: (value) => (value ? value.toUpperCase() : value),
        },
      ],
    });
    const wrapper = mount(Form);
    wrappers.push(wrapper);
    await flushPromises();

    expect(await formApi.getValues()).toEqual({ name: 'HELLO' });
    await wrapper.find('button').trigger('click');
    await flushPromises();

    expect(handleReset).toHaveBeenCalledOnce();
    expect(handleReset).toHaveBeenCalledWith({ name: 'HELLO' });
  });

  it('setValues with multiple fields does not fire handleValuesChange with intermediate state', async () => {
    const handleValuesChange = vi.fn();
    const [Form, formApi] = useVbenForm({
      handleValuesChange,
      schema: [
        { component: TestInput, fieldName: 'first' },
        { component: TestInput, fieldName: 'second' },
        { component: TestInput, fieldName: 'third' },
      ],
    });
    const wrapper = mount(Form);
    wrappers.push(wrapper);
    await flushPromises();
    vi.useFakeTimers();

    const initialCallCount = handleValuesChange.mock.calls.length;
    await formApi.setValues({ first: 'a', second: 'b', third: 'c' });
    await flushPromises();
    vi.advanceTimersByTime(500);
    await flushPromises();

    const calls = handleValuesChange.mock.calls.slice(initialCallCount);
    const rawValuesFromLatestCall = calls[calls.length - 1]?.[0];
    expect(rawValuesFromLatestCall).toMatchObject({
      first: 'a',
      second: 'b',
      third: 'c',
    });
  });

  it('retains unspecified fields on partial reset', async () => {
    const [Form, formApi] = useVbenForm({
      schema: [
        { component: TestInput, defaultValue: 'original', fieldName: 'name' },
        { component: TestInput, defaultValue: 'keep', fieldName: 'alias' },
      ],
    });
    const wrapper = mount(Form);
    wrappers.push(wrapper);
    await flushPromises();

    await formApi.reset({ values: { name: 'reset' } });
    await flushPromises();

    const values = await formApi.getValues();
    expect(values).toMatchObject({ name: 'reset' });
  });

  it('valueFormat is applied consistently across getValues, validateAndSubmit, and getValueSnapshot', async () => {
    const handleSubmit = vi.fn();
    const [Form, formApi] = useVbenForm({
      handleSubmit,
      schema: [
        {
          component: TestInput,
          fieldName: 'name',
          valueFormat: (value) => (value ? value.trim().toUpperCase() : ''),
        },
      ],
    });
    const wrapper = mount(Form);
    wrappers.push(wrapper);
    await flushPromises();

    await formApi.setFieldValue('name', '  hello  ');
    await flushPromises();

    expect(await formApi.getValues()).toEqual({ name: 'HELLO' });

    const snapshot = await formApi.getValueSnapshot();
    expect(snapshot.values).toEqual({ name: 'HELLO' });
    expect(snapshot.rawValues).toEqual({ name: '  hello  ' });

    await formApi.validateAndSubmit();
    await flushPromises();
    expect(handleSubmit).toHaveBeenCalledWith(
      { name: 'HELLO' },
      { name: '  hello  ' },
    );
  });
});
