---
outline: deep
---

# Vben TableAction

`TableAction` renders a group of action buttons for table operation columns, inspired by the TableAction component from vben2. Built on shadcn-ui, it supports permission control, popconfirm, tooltips, a "more" dropdown, and dividers, and can be reused inside or outside tables.

> If the documentation does not cover the details you need, please refer to the online examples.

::: info Before you start

The component carries no business logic (it does not read the permission store directly); permissions are handled by injecting `hasPermission`, keeping the core layer decoupled and reusable across frameworks. Inside vxe-table, the recommended approach is to render it via a column slot (`slots: { default: 'action' }`) on the page, without changing the table's original rendering mechanism. :::

## Basic Usage

Pass an array of action items via `actions`, each with `text`, `onClick`, etc. `danger` marks destructive actions, and `divider` shows separators between buttons.

<DemoPreview dir="demos/vben-table-action/basic" />

## Tooltip

Add a tooltip to an action via `tooltip`, accepting a string or a `{ content, side }` object.

<DemoPreview dir="demos/vben-table-action/tooltip" />

## PopConfirm

Use `popConfirm` to require confirmation before the action runs, commonly used for destructive actions like delete.

<DemoPreview dir="demos/vben-table-action/popconfirm" />

## More Dropdown

Use `dropdownActions` to collapse secondary actions into a "more" dropdown. `moreText` customizes the button label.

<DemoPreview dir="demos/vben-table-action/dropdown" />

## Permission Control

Set an `auth` code on an action and inject a `hasPermission` resolver; actions without permission are hidden.

<DemoPreview dir="demos/vben-table-action/permission" />

## Usage with vxe-table

Without changing vxe-table's rendering mechanism, declare a slot in the column config and render it on the page.

::: tip Recommended: use the adapter-wrapped version The project's `#/adapter/vxe-table` re-wraps `VbenTableAction` and injects `hasPermission` internally (based on `useAccess().hasAccessByCodes`). So when you import it from the adapter, **you no longer need to pass `:has-permission`** — just declare permission codes via the `auth` field of each action. :::

```ts
// data.ts — declare a slot in the column config
{
  align: 'center',
  field: 'operation',
  fixed: 'right',
  slots: { default: 'action' },
  title: $t('system.user.operation'),
  width: 180,
}
```

```vue
<!-- list.vue — import from the adapter; permission is auto-injected, no has-permission needed -->
<script setup lang="ts">
import { VbenTableAction } from '#/adapter/vxe-table';
</script>

<template>
  <Grid>
    <template #action="{ row }">
      <template #action="{ row }">
        <VbenTableAction
          :actions="[
            {
              text: $t('common.detail'),
              icon: 'lucide:eye',
              onClick: () => onDetail(row),
            },
            {
              text: $t('common.edit'),
              icon: 'lucide:edit',
              onClick: () => onEdit(row),
            },
          ]"
          :dropdown-actions="[
            {
              text: $t('common.delete'),
              icon: 'lucide:trash-2',
              danger: true,
              onClick: () => onDelete(row),
              auth: ['AC_100100'],
            },
          ]"
          align="center"
        />
      </template>
    </template>
  </Grid>
</template>
```

If you import the core component directly from `@vben/common-ui` (without going through the adapter), the component carries no business logic and you need to inject `hasPermission` yourself:

```vue
<script setup lang="ts">
import { useAccess } from '@vben/access';
import { VbenTableAction } from '@vben/common-ui';

const { hasAccessByCodes } = useAccess();
function hasPermission(auth?: string | string[]) {
  if (!auth) return true;
  return hasAccessByCodes(Array.isArray(auth) ? auth : [auth]);
}
</script>

<template>
  <VbenTableAction
    v-bind="useActions(row, onActionClick)"
    :has-permission="hasPermission"
    align="center"
  />
</template>
```

## API

### TableAction Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| actions | Main action buttons | `ActionItem[]` | `[]` |
| dropdownActions | Actions inside the "more" dropdown | `ActionItem[]` | `[]` |
| align | Alignment | `'start' \| 'center' \| 'end'` | `'end'` |
| divider | Whether to show separators between buttons | `boolean` | `false` |
| moreText | Label for the "more" button (shown beside the icon) | `string` | - |
| hasPermission | Permission resolver; returning `false` hides the action with that `auth` (auto-injected when imported from `#/adapter/vxe-table`, no need to pass manually) | `(auth?: string \| string[]) => boolean` | - |
| class | Custom class for the root node | `string` | - |

### ActionItem

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| text | Button text | `string` | - |
| icon | Icon component | `string` \| `VbenIcon` | - |
| onClick | Click callback | `() => void` | - |
| auth | Permission code, filtered by `hasPermission` | `string \| string[]` | - |
| ifShow | Whether to show | `boolean \| (() => boolean)` | `true` |
| disabled | Whether disabled | `boolean` | `false` |
| loading | Loading state | `boolean` | `false` |
| danger | Destructive action (red text) | `boolean` | `false` |
| tooltip | Tooltip | `string \| { content: string; side?: 'top' \| 'bottom' \| 'left' \| 'right' }` | - |
| popConfirm | PopConfirm | `TableActionPopConfirm` | - |
| variant | Button variant | `ButtonVariants['variant']` | `'link'` |
| size | Button size | `ButtonVariants['size']` | `'sm'` |
| key | Unique key | `string \| number` | - |

### TableActionPopConfirm

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| title | Confirm title | `string` | `'Are you sure?'` |
| okText | Confirm button text | `string` | `'OK'` |
| cancelText | Cancel button text | `string` | `'Cancel'` |
| confirm | Confirm callback; falls back to `action.onClick` if omitted | `() => void` | - |
