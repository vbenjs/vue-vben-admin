---
outline: deep
---

# Vben Form

`Vben Form` is the shared form abstraction used across different UI-library variants such as `Ant Design Vue`, `Element Plus`, `Naive UI`, and other adapters added inside this repository.

It uses [TanStack Form](https://tanstack.com/form/latest/docs/framework/vue/overview) internally for state and validation lifecycles, with [Zod 4](https://zod.dev/v4) schemas. Application code should continue using `useVbenForm`, `FormApi`, and the adapter layer instead of depending on the raw TanStack instance.

Read the [Zod 4 and TanStack Form migration guide](/en/guide/in-depth/zod-v4-form-migration) before upgrading an existing project.

> If some details are not obvious from the docs, check the live demos as well.

## Adapter Setup

Each app keeps its own adapter layer under `src/adapter/form.ts` and `src/adapter/component/index.ts`.

The current adapter pattern is:

- initialize the shared component adapter first
- call `setupVbenForm(...)`
- map special `v-model:*` prop names through `modelPropNameMap`
- keep the form empty state aligned with the actual UI library behavior

### Form Adapter Example

```ts
import type {
  FormValues,
  VbenFormProps as FormProps,
  VbenFormSchema as FormSchema,
} from '@vben/common-ui';

import type { ComponentType } from './component';

import { setupVbenForm, useVbenForm as useForm, z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { initComponentAdapter } from './component';

initComponentAdapter();
setupVbenForm<ComponentType>({
  config: {
    baseModelPropName: 'value',
    emptyStateValue: null,
    modelPropNameMap: {
      Checkbox: 'checked',
      Radio: 'checked',
      Switch: 'checked',
      Upload: 'fileList',
    },
  },
  rules: {
    required: (value, _params, ctx) => {
      if (value === undefined || value === null || value.length === 0) {
        return $t('ui.formRules.required', [ctx.label]);
      }
      return true;
    },
    selectRequired: (value, _params, ctx) => {
      if (value === undefined || value === null) {
        return $t('ui.formRules.selectRequired', [ctx.label]);
      }
      return true;
    },
  },
});

function useVbenForm<TValues extends FormValues = FormValues>(
  options: FormProps<ComponentType, Record<never, never>, TValues>,
) {
  return useForm<TValues, ComponentType, Record<never, never>>(options);
}

export { useVbenForm, z };
export type VbenFormSchema<TValues extends FormValues = FormValues> =
  FormSchema<ComponentType, Record<never, never>, TValues>;
export type VbenFormProps<TValues extends FormValues = FormValues> = FormProps<
  ComponentType,
  Record<never, never>,
  TValues
>;
```

### Component Adapter Example

```ts
import type { Component, SetupContext } from 'vue';

import type { BaseFormComponentType } from '@vben/common-ui';

import { h } from 'vue';

import { globalShareState } from '@vben/common-ui';
import { $t } from '@vben/locales';
import {
  AutoComplete,
  Button,
  Checkbox,
  CheckboxGroup,
  DatePicker,
  Divider,
  Input,
  InputNumber,
  InputPassword,
  Mentions,
  notification,
  Radio,
  RadioGroup,
  RangePicker,
  Rate,
  Select,
  Space,
  Switch,
  Textarea,
  TimePicker,
  TreeSelect,
  Upload,
} from 'antdv-next';

const withDefaultPlaceholder = <T extends Component>(
  component: T,
  type: 'input' | 'select',
) => {
  return (props: any, { attrs, slots }: Omit<SetupContext, 'expose'>) => {
    const placeholder = props?.placeholder || $t(`ui.placeholder.${type}`);
    return h(component, { ...props, ...attrs, placeholder }, slots);
  };
};

export type ComponentType =
  | 'AutoComplete'
  | 'Checkbox'
  | 'CheckboxGroup'
  | 'DatePicker'
  | 'DefaultButton'
  | 'Divider'
  | 'Input'
  | 'InputNumber'
  | 'InputPassword'
  | 'Mentions'
  | 'PrimaryButton'
  | 'Radio'
  | 'RadioGroup'
  | 'RangePicker'
  | 'Rate'
  | 'Select'
  | 'Space'
  | 'Switch'
  | 'Textarea'
  | 'TimePicker'
  | 'TreeSelect'
  | 'Upload'
  | BaseFormComponentType;

async function initComponentAdapter() {
  const components: Partial<Record<ComponentType, Component>> = {
    AutoComplete,
    Checkbox,
    CheckboxGroup,
    DatePicker,
    DefaultButton: (props, { attrs, slots }) => {
      return h(Button, { ...props, attrs, type: 'default' }, slots);
    },
    Divider,
    Input: withDefaultPlaceholder(Input, 'input'),
    InputNumber: withDefaultPlaceholder(InputNumber, 'input'),
    InputPassword: withDefaultPlaceholder(InputPassword, 'input'),
    Mentions: withDefaultPlaceholder(Mentions, 'input'),
    PrimaryButton: (props, { attrs, slots }) => {
      return h(Button, { ...props, attrs, type: 'primary' }, slots);
    },
    Radio,
    RadioGroup,
    RangePicker,
    Rate,
    Select: withDefaultPlaceholder(Select, 'select'),
    Space,
    Switch,
    Textarea: withDefaultPlaceholder(Textarea, 'input'),
    TimePicker,
    TreeSelect: withDefaultPlaceholder(TreeSelect, 'select'),
    Upload,
  };

  globalShareState.setComponents(components);
  globalShareState.defineMessage({
    copyPreferencesSuccess: (title, content) => {
      notification.success({
        description: content,
        message: title,
        placement: 'bottomRight',
      });
    },
  });
}

export { initComponentAdapter };
```

## Basic Usage

Create the form through `useVbenForm`:

<DemoPreview dir="demos/vben-form/basic" />

## Typed Values and Slots

Use `useVbenForm<TFormValues, TSubmitValues>` to declare component-facing form values and submission values separately. Schema, slots, selectors, and `setValues` use `TFormValues`; `getValues`, submit, and the first `handleSubmit` argument use `TSubmitValues`. Pass one generic when both shapes are identical.

```vue
<script setup lang="ts">
import { useVbenForm } from '#/adapter/form';

interface AccountFormValues {
  email: string;
  nickname: string;
}

const [Form, formApi] = useVbenForm<AccountFormValues>({
  handleSubmit(values) {
    return addAccount(values); // AccountFormValues
  },
  schema: [
    { component: 'Input', fieldName: 'email', label: 'Email' },
    { component: 'Input', fieldName: 'nickname', label: 'Nickname' },
  ],
});

async function fillForm() {
  await formApi.setValues({ email: 'user@example.com' });
  return formApi.getValues(); // Promise<AccountFormValues>
}
</script>

<template>
  <Form>
    <template #email="{ componentField, field, formApi, values }">
      <!-- field.state.value and componentField.modelValue are strings -->
      <input v-bind="componentField" :data-email="values.email" />
      <button type="button" @click="formApi.clearValidation('email')">
        Clear
      </button>
    </template>
    <template #default="{ formApi, shapes, values }">
      <button type="button" @click="formApi.submit()">
        Submit {{ shapes.length }} fields for {{ values.email }}
      </button>
    </template>
  </Form>
</template>
```

Named field slots expose `field`, `componentField`, `modelValue`, `name`, `disabled`, `isInValid`, `values`, and `formApi`. The default slot exposes `shapes`, `values`, and `formApi`; action slots expose `values` and `formApi`. Forms without an explicit `TValues` remain compatible with arbitrary slot names and broad props.

## Form Codec

Use the form-level `codec` when component values and the backend payload have different shapes. `encode` converts the complete `TFormValues` object to `TSubmitValues`; `decode` performs the inverse conversion. Multi-field splits and merges are atomic and do not depend on schema order or string-path writes.

Define `codec` directly in the `useVbenForm` options. Annotate only the form-value input of `encode`; `TSubmitValues` is inferred from its return object and flows into `decode`, `getValues()`, and submit callbacks:

```ts
const [Form, formApi] = useVbenForm({
  codec: {
    decode(values) {
      return { period: [values.startTime, values.endTime] };
    },
    encode(values: Readonly<FormValues>) {
      return {
        endTime: values.period[1],
        startTime: values.period[0],
      };
    },
  },
  schema,
});
```

<DemoPreview dir="demos/vben-form/value-format" />

`schema.valueFormat`, `fieldMappingTime`, and `arrayToStringFields` remain runtime-compatible but are deprecated. When a codec is configured it takes precedence and deprecated transforms are ignored.

## Performance Benchmarks

The form benchmarks cover component initialization, single-field and batch updates, reset, Zod validation, dynamic schemas, dependencies, codec encoding and snapshots, plus array editing, row mutations, and child-schema updates. Run the complete benchmark suite with:

```bash
pnpm test:benchmark
```

To run only the form benchmarks, pass both files explicitly:

```bash
pnpm exec vitest bench --run packages/@core/ui-kit/form-ui/__tests__/form-component-performance.benchmark.ts packages/@core/ui-kit/form-ui/__tests__/form-performance.benchmark.ts
```

Use benchmark results to compare relative changes on the same machine and runtime; do not treat one run's absolute timings as portable thresholds. Stop CPU-intensive development servers first and keep the Node.js version consistent. Benchmark files are not included in the regular `test:unit` command.

::: warning Mounted form context

`formApi.form` is the `FormContextApi` injected after `<Form />` mounts. Do not destructure or cache `form` from the second `useVbenForm` return value during setup, because that captures the pre-mount empty reference. Prefer mount-aware public methods such as `getRawValues()`, `setFieldError()`, `setFieldValue()`, and `validate()` for business actions. Access fine-grained subscription methods on `formApi.form` only from an already-mounted form context.

:::

## Key API Notes

- `useVbenForm` returns `[Form, formApi]`
- `useVbenForm<TFormValues, TSubmitValues>` keeps component values and submission values distinct
- prefer `reset`, `submit`, `validateAndSubmit`, and `clearValidation`
- `resetForm`, `submitForm`, `validateAndSubmitForm`, and `resetValidate` remain deprecated aliases that warn once in development
- `clearValidation` invalidates in-flight async results before clearing errors
- `formApi.getFieldComponentRef()` and `formApi.getFocusedField()` are available in current versions
- `handleValuesChange(values, fieldsChanged)` receives readonly `TFormValues` before codec or legacy formatting
- its third `getFormattedValues` argument formats lazily, so raw-only change handlers avoid clone and transform work
- `getRawValues()` returns only an independent raw snapshot, `getValues()` returns only the formatted payload, and `getValueSnapshot()` returns both
- `handleSubmit(values, rawValues)` receives the formatted payload and its corresponding raw snapshot
- `fieldMappingTime`, `arrayToStringFields`, and `schema.valueFormat` are deprecated compatibility options
- `codec.encode` defines the `getValues()` payload and `codec.decode` powers complete `setSubmitValues()` fills
- `formApi.form` exposes the mounted `FormContextApi`; do not destructure or cache it before `<Form />` mounts
- prefer `formApi.form.useFieldValue`, `useFieldValues`, and `useFieldError` for fine-grained subscriptions; use `useValues` only when the whole form is required
- `useSelector` remains the compatibility selector for combined `{ values, errors, meta }` state
- legacy `setupVbenForm({ defineRules })` still works, warns once in development, and is silent in production; use `rules` for new code
- prefer `dependencies: { triggerFields, resolve(context) }` for one atomic dynamic-state patch; legacy dependency callbacks remain supported but are deprecated and warn once in development
- top-level `componentProps`, `help`, and `renderComponentContent` functions receive `FormSchemaContext`; value-dependent rendering belongs in `dependencies.resolve`
- use `formFieldProps.validateOn` with `blur` and/or `change`; submit always validates, and `asyncDebounceMs` debounces async validators
- use `changeEventFallback: true` only for components that emit `change` without an `update:*` event

## Reference

For the complete Chinese API tables and more examples, see the Chinese component page if you need the full parameter matrix.
