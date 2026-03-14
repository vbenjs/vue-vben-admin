---
outline: deep
---

# Vben ApiComponent

`ApiComponent` is a wrapper used to attach remote-option loading behavior to an existing component while preserving the original component usage pattern.

## Common Usage

The current wrapper flow is:

- pass the target component through `component`
- fetch remote data through `api`
- transform data through `beforeFetch` and `afterFetch`
- map remote fields through `resultField`, `valueField`, `labelField`, and `childrenField`
- pass normalized options to the target component through `optionsPropName`

```vue
<script lang="ts" setup>
import { ApiComponent } from '@vben/common-ui';

import { Cascader } from 'ant-design-vue';

function fetchApi() {
  return Promise.resolve([
    {
      label: 'Zhejiang',
      value: 'zhejiang',
      children: [{ label: 'Hangzhou', value: 'hangzhou' }],
    },
  ]);
}
</script>

<template>
  <ApiComponent
    :api="fetchApi"
    :component="Cascader"
    :immediate="false"
    children-field="children"
    loading-slot="suffixIcon"
    visible-event="onDropdownVisibleChange"
  />
</template>
```

## Current Props

| Prop | Description | Type |
| --- | --- | --- |
| `component` | wrapped target component | `Component` |
| `api` | remote request function | `(arg?: any) => Promise<any>` |
| `params` | extra request params | `Record<string, any>` |
| `beforeFetch` | hook before request | `AnyPromiseFunction` |
| `afterFetch` | hook after request | `AnyPromiseFunction` |
| `visibleEvent` | event name used to lazy-load data | `string` |
| `loadingSlot` | slot name used to render the loading icon | `string` |
| `modelPropName` | model prop name of the wrapped component | `string` |
| `autoSelect` | auto-pick the first / last / only option, or use a custom function | `'first' \| 'last' \| 'one' \| ((items) => item) \| false` |

## Exposed Methods

| Method                   | Description                            |
| ------------------------ | -------------------------------------- |
| `getComponentRef()`      | returns the wrapped component instance |
| `updateParam(newParams)` | merges and updates request params      |
| `getOptions()`           | returns loaded options                 |
| `getValue()`             | returns the current bound value        |
