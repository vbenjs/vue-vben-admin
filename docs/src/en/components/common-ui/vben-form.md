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

Declare the value shape once with `useVbenForm<TValues>`. The same type flows through value APIs, callbacks, selectors, and field/default/action slots:

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

## Value Formatting

Use `schema.valueFormat` when the component value is convenient for the UI but the final payload returned by `getValues()` should use a different shape.

- return a value to write back to the current field
- call `setValue(key, nextValue)` to write derived fields
- return `undefined` to keep the original field removed after decomposition

<DemoPreview dir="demos/vben-form/value-format" />

## Key API Notes

- `useVbenForm` returns `[Form, formApi]`
- `useVbenForm<TValues>` propagates values through APIs, callbacks, schema callbacks, and slots
- prefer `reset`, `submit`, `validateAndSubmit`, and `clearValidation`
- `resetForm`, `submitForm`, `validateAndSubmitForm`, and `resetValidate` remain deprecated aliases that warn once in development
- `clearValidation` invalidates in-flight async results before clearing errors
- `formApi.getFieldComponentRef()` and `formApi.getFocusedField()` are available in current versions
- `handleValuesChange(values, fieldsChanged)` receives readonly raw form state before `valueFormat`, `fieldMappingTime`, or array-to-string conversion
- its third `getFormattedValues` argument formats lazily, so raw-only change handlers avoid clone and transform work
- `getRawValues()` returns only an independent raw snapshot, `getValues()` returns only the formatted payload, and `getValueSnapshot()` returns both
- `handleSubmit(values, rawValues)` receives the formatted payload and its corresponding raw snapshot
- `fieldMappingTime` and `scrollToFirstError` are part of the current form props
- `schema.valueFormat` lets `getValues()` transform UI values into backend-friendly payloads
- `formApi.form` is the stable `FormContextApi`; raw TanStack generics are intentionally not exposed
- prefer `formApi.form.useFieldValue`, `useFieldValues`, and `useFieldError` for fine-grained subscriptions; use `useValues` only when the whole form is required
- `useSelector` remains the compatibility selector for combined `{ values, errors, meta }` state
- legacy `setupVbenForm({ defineRules })` still works, warns once in development, and is silent in production; use `rules` for new code
- prefer `dependencies: { triggerFields, resolve(context) }` for one atomic dynamic-state patch; legacy dependency callbacks remain supported but are deprecated and warn once in development
- top-level `componentProps`, `help`, and `renderComponentContent` functions receive `FormSchemaContext`; value-dependent rendering belongs in `dependencies.resolve`
- use `formFieldProps.validateOn` with `blur` and/or `change`; submit always validates, and `asyncDebounceMs` debounces async validators
- use `changeEventFallback: true` only for components that emit `change` without an `update:*` event

## Reference

For the complete Chinese API tables and more examples, see the Chinese component page if you need the full parameter matrix.
