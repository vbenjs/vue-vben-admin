/* eslint-disable vue/one-component-per-file */

import type { VueWrapper } from '@vue/test-utils';

import type {
  FormSchema,
  FormSchemaRuleType,
  VbenFormFieldSlotProps,
} from '../src/types';

import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';

import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { z } from 'zod';

import {
  COMPONENT_BIND_EVENT_MAP,
  COMPONENT_MAP,
  setupVbenForm,
} from '../src/config';
import { resetDeprecationWarnings } from '../src/deprecation';
import { useVbenForm } from '../src/use-vben-form';

const wrappers: VueWrapper[] = [];

type TestRegisteredComponent = 'TestCheckedInput' | 'TestValueInput';

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

const TestValueInput = defineComponent({
  inheritAttrs: false,
  emits: ['update:value'],
  setup(_props, { attrs, emit }) {
    function handleClick() {
      emit('update:value', 'value-updated');
    }

    return () =>
      h('button', {
        ...attrs,
        class: 'test-value-input',
        'data-value': String(attrs.value ?? ''),
        onClick: handleClick,
      });
  },
});

const TestCheckedInput = defineComponent({
  inheritAttrs: false,
  emits: ['update:checked', 'update:value'],
  setup(_props, { attrs, emit }) {
    function handleClick() {
      if (Reflect.has(attrs, 'value')) {
        emit('update:value', 'explicit-value-updated');
        return;
      }
      emit('update:checked', 'checked-updated');
    }

    return () =>
      h('button', {
        ...attrs,
        class: 'test-checked-input',
        'data-checked': String(attrs.checked ?? ''),
        'data-has-model-value': String(Reflect.has(attrs, 'modelValue')),
        'data-has-model-value-handler': String(
          Reflect.has(attrs, 'onUpdate:modelValue'),
        ),
        'data-value': String(attrs.value ?? ''),
        onClick: handleClick,
      });
  },
});

const TestTextarea = defineComponent({
  inheritAttrs: false,
  emits: ['update:modelValue'],
  setup(_props, { attrs, emit }) {
    function handleInput(event: Event) {
      const target = event.target;
      if (target instanceof HTMLTextAreaElement) {
        emit('update:modelValue', target.value);
      }
    }

    return () =>
      h('textarea', {
        ...attrs,
        class: 'test-textarea',
        onInput: handleInput,
        value: attrs.modelValue ?? '',
      });
  },
});

const originalTestCheckedInput = COMPONENT_MAP.TestCheckedInput;
const originalTestValueInput = COMPONENT_MAP.TestValueInput;
const originalTestCheckedModelProp = COMPONENT_BIND_EVENT_MAP.TestCheckedInput;
const originalTestValueModelProp = COMPONENT_BIND_EVENT_MAP.TestValueInput;

beforeAll(() => {
  COMPONENT_MAP.TestCheckedInput = TestCheckedInput;
  COMPONENT_MAP.TestValueInput = TestValueInput;
  COMPONENT_BIND_EVENT_MAP.TestCheckedInput = 'checked';
  COMPONENT_BIND_EVENT_MAP.TestValueInput = 'value';
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

afterAll(() => {
  if (originalTestCheckedInput) {
    COMPONENT_MAP.TestCheckedInput = originalTestCheckedInput;
  } else {
    Reflect.deleteProperty(COMPONENT_MAP, 'TestCheckedInput');
  }
  if (originalTestValueInput) {
    COMPONENT_MAP.TestValueInput = originalTestValueInput;
  } else {
    Reflect.deleteProperty(COMPONENT_MAP, 'TestValueInput');
  }
  if (originalTestCheckedModelProp) {
    COMPONENT_BIND_EVENT_MAP.TestCheckedInput = originalTestCheckedModelProp;
  } else {
    Reflect.deleteProperty(COMPONENT_BIND_EVENT_MAP, 'TestCheckedInput');
  }
  if (originalTestValueModelProp) {
    COMPONENT_BIND_EVENT_MAP.TestValueInput = originalTestValueModelProp;
  } else {
    Reflect.deleteProperty(COMPONENT_BIND_EVENT_MAP, 'TestValueInput');
  }
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

  it('keeps values reactive when exposed through the default slot', async () => {
    const [Form, formApi] = useVbenForm({
      schema: [
        {
          component: TestInput,
          defaultValue: 'Ada',
          fieldName: 'name',
        },
      ],
      showDefaultActions: false,
    });
    const wrapper = mount(Form, {
      slots: {
        default: ({ values }: { values: Record<string, any> }) =>
          h('span', { class: 'slot-value' }, values.name),
      },
    });
    wrappers.push(wrapper);
    await flushPromises();

    expect(wrapper.get('.slot-value').text()).toBe('Ada');

    await formApi.setFieldValue('name', 'Grace');
    await flushPromises();

    expect(wrapper.get('.slot-value').text()).toBe('Grace');
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

  it('switches registered and direct components with their model protocols', async () => {
    interface DynamicComponentValues {
      mode: string;
      target: string;
    }

    const [Form, formApi] = useVbenForm<
      DynamicComponentValues,
      TestRegisteredComponent
    >({
      schema: [
        {
          component: TestInput,
          defaultValue: 'value',
          fieldName: 'mode',
        },
        {
          component: 'TestValueInput',
          defaultValue: 'initial',
          dependencies: {
            resolve({ values }) {
              if (values.mode === 'checked') {
                return { component: 'TestCheckedInput' };
              }
              if (values.mode === 'direct') {
                return { component: TestTextarea };
              }
              return { component: 'TestValueInput' };
            },
            triggerFields: ['mode'],
          },
          fieldName: 'target',
        },
      ],
    });
    const wrapper = mount(Form);
    wrappers.push(wrapper);
    await flushPromises();

    const valueInput = wrapper.get('.test-value-input');
    expect(valueInput.attributes('data-value')).toBe('initial');
    await valueInput.trigger('click');
    await flushPromises();
    expect(await formApi.getValues()).toEqual({
      mode: 'value',
      target: 'value-updated',
    });

    await formApi.setFieldValue('mode', 'checked');
    await flushPromises();
    const checkedInput = wrapper.get('.test-checked-input');
    expect(checkedInput.attributes('data-checked')).toBe('value-updated');
    await checkedInput.trigger('click');
    await flushPromises();
    expect(await formApi.getValues()).toEqual({
      mode: 'checked',
      target: 'checked-updated',
    });

    await formApi.setFieldValue('mode', 'direct');
    await flushPromises();
    expect(wrapper.get('.test-textarea').attributes('value')).toBe(
      'checked-updated',
    );
  });

  it('falls back to the static component for incomplete dependency snapshots', async () => {
    interface DependencySnapshotValues {
      mode: string;
      target: string;
    }

    type TestSchema = FormSchema<
      TestRegisteredComponent,
      Record<never, never>,
      DependencySnapshotValues
    >;

    const staticTargetSchema: TestSchema = {
      component: 'TestValueInput',
      defaultValue: 'initial',
      fieldName: 'target',
    };
    const dynamicTargetSchema: TestSchema = {
      ...staticTargetSchema,
      dependencies: {
        resolve({ values }) {
          if (values.mode === 'checked') {
            return { component: 'TestCheckedInput' };
          }
          if (values.mode === 'partial') {
            return { disabled: true };
          }
          return undefined;
        },
        triggerFields: ['mode'],
      },
    };
    const modeSchema: TestSchema = {
      component: TestInput,
      defaultValue: 'checked',
      fieldName: 'mode',
    };
    const [Form, formApi] = useVbenForm<
      DependencySnapshotValues,
      TestRegisteredComponent
    >({
      schema: [modeSchema, dynamicTargetSchema],
    });
    const wrapper = mount(Form);
    wrappers.push(wrapper);
    await flushPromises();

    expect(wrapper.find('.test-checked-input').exists()).toBe(true);

    await formApi.setFieldValue('mode', 'partial');
    await flushPromises();
    expect(wrapper.find('.test-value-input').exists()).toBe(true);
    expect(wrapper.get('.test-value-input').attributes('disabled')).toBe('');

    await formApi.setFieldValue('mode', 'undefined');
    await flushPromises();
    expect(wrapper.find('.test-value-input').exists()).toBe(true);
    expect(wrapper.get('.test-value-input').attributes('disabled')).toBe(
      undefined,
    );

    await formApi.setFieldValue('mode', 'checked');
    await flushPromises();
    expect(wrapper.find('.test-checked-input').exists()).toBe(true);

    await formApi.setState({ schema: [modeSchema, staticTargetSchema] });
    await flushPromises();
    expect(wrapper.find('.test-value-input').exists()).toBe(true);
  });

  it('keeps an explicit model prop name when the component changes', async () => {
    const [Form, formApi] = useVbenForm({
      schema: [
        {
          component: 'TestCheckedInput',
          componentProps: {
            modelValue: 'stale-model-value',
            'onUpdate:modelValue': vi.fn(),
          },
          defaultValue: 'initial',
          dependencies: {
            resolve: () => ({ component: 'TestCheckedInput' }),
            triggerFields: ['mode'],
          },
          fieldName: 'target',
          modelPropName: 'value',
        },
      ],
    });
    const wrapper = mount(Form);
    wrappers.push(wrapper);
    await flushPromises();

    const checkedInput = wrapper.get('.test-checked-input');
    expect(checkedInput.attributes('data-value')).toBe('initial');
    expect(checkedInput.attributes('data-checked')).toBe('');
    expect(checkedInput.attributes('data-has-model-value')).toBe('false');
    expect(checkedInput.attributes('data-has-model-value-handler')).toBe(
      'false',
    );
    await checkedInput.trigger('click');
    await flushPromises();
    expect(await formApi.getValues()).toEqual({
      target: 'explicit-value-updated',
    });
  });

  it('ignores stale asynchronous component selections', async () => {
    const slowComponent = createDeferred<{
      component: typeof TestValueInput;
    }>();
    const [Form, formApi] = useVbenForm({
      schema: [
        {
          component: TestInput,
          fieldName: 'mode',
        },
        {
          component: TestInput,
          dependencies: {
            resolve({ values }) {
              if (values.mode === 'slow') {
                return slowComponent.promise;
              }
              if (values.mode === 'fast') {
                return { component: TestTextarea };
              }
              return { component: TestInput };
            },
            triggerFields: ['mode'],
          },
          fieldName: 'target',
        },
      ],
    });
    const wrapper = mount(Form);
    wrappers.push(wrapper);
    await flushPromises();

    await formApi.setFieldValue('mode', 'slow');
    await flushPromises();
    await formApi.setFieldValue('mode', 'fast');
    await flushPromises();
    expect(wrapper.find('.test-textarea').exists()).toBe(true);

    slowComponent.resolve({ component: TestValueInput });
    await flushPromises();
    expect(wrapper.find('.test-textarea').exists()).toBe(true);
    expect(wrapper.find('.test-value-input').exists()).toBe(false);
  });

  it('warns when a dynamically selected component is not registered', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const [Form] = useVbenForm({
      schema: [
        {
          component: TestInput,
          dependencies: {
            resolve: () => ({ component: 'MissingDynamicComponent' }),
            triggerFields: ['mode'],
          },
          fieldName: 'target',
        },
      ],
    });
    const wrapper = mount(Form);
    wrappers.push(wrapper);
    await flushPromises();

    expect(warning).toHaveBeenCalledWith(
      'Component MissingDynamicComponent is not registered',
    );
  });

  it('exposes grouped dynamic component props to field slots', async () => {
    interface DynamicFormValues {
      mode: string;
      target: string;
    }

    let latestSlotProps:
      | undefined
      | VbenFormFieldSlotProps<DynamicFormValues, 'target'>;
    const [Form, formApi] = useVbenForm<DynamicFormValues>({
      schema: [
        {
          component: TestInput,
          defaultValue: 'value',
          fieldName: 'mode',
        },
        {
          component: 'TestValueInput',
          defaultValue: 'initial',
          dependencies: {
            resolve({ values }) {
              if (values.mode === 'direct') {
                return { component: TestTextarea };
              }
              return {
                component:
                  values.mode === 'checked'
                    ? 'TestCheckedInput'
                    : 'TestValueInput',
              };
            },
            triggerFields: ['mode'],
          },
          fieldName: 'target',
        },
      ],
    });
    const wrapper = mount(Form, {
      slots: {
        target(slotProps: VbenFormFieldSlotProps<DynamicFormValues, 'target'>) {
          latestSlotProps = slotProps;
          return slotProps.component
            ? h(slotProps.component, {
                ...slotProps.componentProps,
                class: 'slot-component',
              })
            : null;
        },
      },
    });
    wrappers.push(wrapper);
    await flushPromises();

    expect(latestSlotProps).toBeDefined();
    if (!latestSlotProps) return;
    expect(latestSlotProps.values).toEqual({
      mode: 'value',
      target: 'initial',
    });
    expect(latestSlotProps.formApi).toBe(formApi);
    expect(latestSlotProps.componentProps).not.toHaveProperty('formApi');
    expect(latestSlotProps.componentProps).not.toHaveProperty('values');
    expect(Reflect.has(latestSlotProps, 'value')).toBe(false);
    expect(Reflect.has(latestSlotProps, 'onUpdate:modelValue')).toBe(false);
    expect(latestSlotProps.modelValue).toBe('initial');
    expect(latestSlotProps.componentField.modelValue).toBe('initial');
    expect(latestSlotProps.componentProps.value).toBe('initial');
    expect(latestSlotProps.componentProps).toHaveProperty('onUpdate:value');
    expect(latestSlotProps.componentProps).not.toHaveProperty('modelValue');
    expect(latestSlotProps.componentProps).not.toHaveProperty(
      'onUpdate:modelValue',
    );

    const valueInput = wrapper.get('.test-value-input');
    await valueInput.trigger('click');
    await valueInput.trigger('blur');
    await flushPromises();
    expect(latestSlotProps.field.state.meta.isDirty).toBe(true);
    expect(latestSlotProps.field.state.meta.isTouched).toBe(true);

    await formApi.setFieldValue('mode', 'checked');
    await flushPromises();
    expect(wrapper.find('.test-value-input').exists()).toBe(false);
    expect(wrapper.get('.test-checked-input').attributes('data-checked')).toBe(
      'value-updated',
    );
    expect(latestSlotProps.modelValue).toBe('value-updated');
    expect(latestSlotProps.componentField.modelValue).toBe('value-updated');
    expect(latestSlotProps.componentProps.checked).toBe('value-updated');
    expect(latestSlotProps.componentProps).toHaveProperty('onUpdate:checked');
    expect(latestSlotProps.componentProps).not.toHaveProperty('modelValue');
    expect(latestSlotProps.componentProps).not.toHaveProperty(
      'onUpdate:modelValue',
    );
    expect(latestSlotProps.values.mode).toBe('checked');
    expect(latestSlotProps.field.state.meta.isDirty).toBe(true);
    expect(latestSlotProps.field.state.meta.isTouched).toBe(true);

    await formApi.setFieldValue('mode', 'direct');
    await flushPromises();
    expect(wrapper.find('.test-textarea').exists()).toBe(true);
    expect(latestSlotProps.componentProps.modelValue).toBe('value-updated');
    expect(latestSlotProps.componentProps).toHaveProperty(
      'onUpdate:modelValue',
    );
    expect(latestSlotProps.componentProps).not.toHaveProperty('value');
    expect(latestSlotProps.componentProps).not.toHaveProperty('checked');
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

  it('preserves array row inputs and focus while editing', async () => {
    const [Form] = useVbenForm({
      schema: [
        {
          children: [
            {
              component: TestInput,
              fieldName: 'name',
              label: 'Name',
            },
          ],
          defaultValue: [{ name: 'Ada' }],
          fieldName: 'contacts',
          type: 'array',
        },
      ],
    });
    const wrapper = mount(Form, { attachTo: document.body });
    wrappers.push(wrapper);
    await flushPromises();
    const input = wrapper.get('input');
    const inputElement = input.element;
    inputElement.focus();

    await input.setValue('Ada Lovelace');
    await flushPromises();

    expect(wrapper.get('input').element).toBe(inputElement);
    expect((input.element as HTMLInputElement).value).toBe('Ada Lovelace');
    expect(document.activeElement).toBe(inputElement);
  });

  it('updates optimized array rows when values and schemas change', async () => {
    const [Form, formApi] = useVbenForm({
      schema: [
        {
          children: [
            {
              component: TestInput,
              fieldName: 'name',
              label: 'Name',
            },
          ],
          defaultValue: [{ name: 'Ada' }, { name: 'Grace' }],
          fieldName: 'contacts',
          type: 'array',
        },
      ],
    });
    const wrapper = mount(Form);
    wrappers.push(wrapper);
    await flushPromises();
    const firstInput = wrapper.get('input[name="contacts[0].name"]');
    const firstInputElement = firstInput.element;

    await formApi.setFieldValue('contacts[0].name', 'Ada Lovelace');
    await flushPromises();

    expect(wrapper.get('input[name="contacts[0].name"]').element).toBe(
      firstInputElement,
    );
    expect(firstInput.element.getAttribute('value')).toBe('Ada Lovelace');

    formApi.updateSchema([
      {
        componentProps: { disabled: true },
        fieldName: 'contacts.name',
      },
    ]);
    await flushPromises();

    expect(
      wrapper.get('input[name="contacts[0].name"]').attributes(),
    ).toHaveProperty('disabled');
    expect(
      wrapper.get('input[name="contacts[1].name"]').attributes(),
    ).toHaveProperty('disabled');
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

  it('selects dynamic components independently for array rows', async () => {
    const [Form, formApi] = useVbenForm({
      schema: [
        {
          children: [
            {
              component: TestInput,
              fieldName: 'role',
              label: 'Role',
            },
            {
              component: 'TestValueInput',
              dependencies: {
                resolve({ schema }) {
                  return {
                    component:
                      schema.row?.role === 'viewer'
                        ? 'TestCheckedInput'
                        : 'TestValueInput',
                  };
                },
                triggerFields: ['role'],
              },
              fieldName: 'phone',
              label: 'Phone',
            },
          ],
          defaultValue: [
            { phone: 'viewer-phone', role: 'viewer' },
            { phone: 'owner-phone', role: 'owner' },
          ],
          fieldName: 'contacts',
          type: 'array',
        },
      ],
    });
    const wrapper = mount(Form);
    wrappers.push(wrapper);
    await flushPromises();

    expect(wrapper.get('[name="contacts[0].phone"]').classes()).toContain(
      'test-checked-input',
    );
    expect(
      wrapper.get('[name="contacts[0].phone"]').attributes('data-checked'),
    ).toBe('viewer-phone');
    expect(wrapper.get('[name="contacts[1].phone"]').classes()).toContain(
      'test-value-input',
    );
    expect(
      wrapper.get('[name="contacts[1].phone"]').attributes('data-value'),
    ).toBe('owner-phone');

    await formApi.setFieldValue('contacts[0].role', 'owner');
    await flushPromises();
    expect(wrapper.get('[name="contacts[0].phone"]').classes()).toContain(
      'test-value-input',
    );
    expect(wrapper.get('[name="contacts[1].phone"]').classes()).toContain(
      'test-value-input',
    );

    await formApi.setFieldValue('contacts[1].role', 'viewer');
    await flushPromises();
    expect(wrapper.get('[name="contacts[0].phone"]').classes()).toContain(
      'test-value-input',
    );
    expect(wrapper.get('[name="contacts[1].phone"]').classes()).toContain(
      'test-checked-input',
    );
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

  it('passes formatted values and raw values to handleSubmit callback', async () => {
    const handleSubmit = vi.fn();
    const [Form, formApi] = useVbenForm({
      codec: {
        decode(values: Readonly<{ normalizedName: string }>) {
          return { name: values.normalizedName };
        },
        encode(values: Readonly<{ name: string }>) {
          return { normalizedName: values.name.trim().toUpperCase() };
        },
      },
      handleSubmit,
      schema: [
        {
          component: TestInput,
          defaultValue: '',
          fieldName: 'name',
          rules: 'required',
        },
      ],
    });
    const wrapper = mount(Form);
    wrappers.push(wrapper);
    await flushPromises();

    await formApi.setFieldValue('name', ' test ');
    await formApi.validateAndSubmit();
    await flushPromises();

    expect(handleSubmit).toHaveBeenCalledOnce();
    expect(handleSubmit).toHaveBeenCalledWith(
      { normalizedName: 'TEST' },
      { name: ' test ' },
    );
  });

  it('does not expose raw values through native form submit events', async () => {
    const onSubmit = vi.fn();
    const [Form, formApi] = useVbenForm({
      schema: [
        {
          component: TestInput,
          defaultValue: '',
          fieldName: 'name',
          rules: 'required',
          valueFormat: (value) => value.trim().toUpperCase(),
        },
      ],
    });
    const wrapper = mount(Form, { attrs: { onSubmit } });
    wrappers.push(wrapper);
    await flushPromises();

    await formApi.setFieldValue('name', ' raw ');
    await wrapper.get('form').trigger('submit');
    await flushPromises();

    expect(onSubmit).toHaveBeenCalledOnce();
    expect(onSubmit).toHaveBeenCalledWith(undefined);
  });

  it('calls handleReset with formatted values on reset button click', async () => {
    const handleReset = vi.fn();
    const [Form, formApi] = useVbenForm({
      codec: {
        decode(values: Readonly<{ normalizedName: string }>) {
          return { name: values.normalizedName };
        },
        encode(values: Readonly<{ name: string }>) {
          return { normalizedName: values.name.toUpperCase() };
        },
      },
      handleReset,
      schema: [
        {
          component: TestInput,
          defaultValue: 'hello',
          fieldName: 'name',
        },
      ],
    });
    const wrapper = mount(Form);
    wrappers.push(wrapper);
    await flushPromises();

    expect(await formApi.getValues()).toEqual({ normalizedName: 'HELLO' });
    const resetButton = wrapper.findAll('button')[0];
    expect(resetButton).toBeDefined();
    if (!resetButton) return;
    await resetButton.trigger('click');
    await flushPromises();

    expect(handleReset).toHaveBeenCalledOnce();
    expect(handleReset).toHaveBeenCalledWith({ normalizedName: 'HELLO' });
  });

  it('setValues with multiple fields emits only the final values', async () => {
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
    const initialCallCount = handleValuesChange.mock.calls.length;

    await formApi.setValues({ first: 'a', second: 'b', third: 'c' });
    await flushPromises();

    const calls = handleValuesChange.mock.calls.slice(initialCallCount);
    expect(calls).toHaveLength(1);
    expect(calls[0]?.[0]).toEqual({
      first: 'a',
      second: 'b',
      third: 'c',
    });
  });

  it('retains initial values for unspecified fields on partial reset', async () => {
    const [Form, formApi] = useVbenForm({
      schema: [
        { component: TestInput, defaultValue: 'original', fieldName: 'name' },
        { component: TestInput, defaultValue: 'keep', fieldName: 'alias' },
      ],
    });
    const wrapper = mount(Form);
    wrappers.push(wrapper);
    await flushPromises();

    await formApi.setValues({ alias: 'changed', name: 'changed' });
    await formApi.reset({ values: { name: 'reset' } });
    await flushPromises();

    expect(await formApi.getValues()).toEqual({
      alias: 'keep',
      name: 'reset',
    });
  });

  it('applies valueFormat consistently across value APIs', async () => {
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

    await formApi.setFieldValue('name', ' hello ');
    await flushPromises();

    expect(await formApi.getValues()).toEqual({ name: 'HELLO' });
    expect(await formApi.getValueSnapshot()).toEqual({
      rawValues: { name: ' hello ' },
      values: { name: 'HELLO' },
    });

    await formApi.validateAndSubmit();
    await flushPromises();
    expect(handleSubmit).toHaveBeenCalledWith(
      { name: 'HELLO' },
      { name: ' hello ' },
    );
  });
});
