---
outline: deep
---

# Vben Vxe Table

`Vben Vxe Table` wraps `vxe-table` together with `Vben Form` so you can build searchable data grids with a shared API.

## Adapter Example

The current renderer adapter uses `renderTableDefault(...)` for table cell rendering:

```ts
vxeUI.renderer.add('CellImage', {
  renderTableDefault(_renderOpts, params) {
    const { column, row } = params;
    return h(Image, { src: row[column.field] });
  },
});

vxeUI.renderer.add('CellLink', {
  renderTableDefault(renderOpts) {
    const { props } = renderOpts;
    return h(
      Button,
      { size: 'small', type: 'link' },
      { default: () => props?.text },
    );
  },
});
```

## Basic Usage

```vue
<script setup lang="ts">
import { useVbenVxeGrid } from '#/adapter/vxe-table';

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {},
  formOptions: {},
  gridEvents: {},
});
</script>

<template>
  <Grid />
</template>
```

<DemoPreview dir="demos/vben-vxe-table/basic" />

## GridApi

| Method | Description | Type |
| --- | --- | --- |
| `setLoading` | update loading state | `(loading: boolean) => void` |
| `setGridOptions` | merge new grid options | `(options: Partial<VxeGridProps['gridOptions']>) => void` |
| `reload` | reload data and reset pagination | `(params?: Record<string, any>) => void` |
| `query` | query data while keeping the current page | `(params?: Record<string, any>) => void` |
| `grid` | `vxe-grid` instance | `VxeGridInstance` |
| `formApi` | search form API | `FormApi` |
| `toggleSearchForm` | toggle or force the search form visible state | `(show?: boolean) => boolean` |

## Props

| Prop | Description | Type |
| --- | --- | --- |
| `tableTitle` | table title | `string` |
| `tableTitleHelp` | help text for the table title | `string` |
| `class` | class for the outer container | `string` |
| `gridClass` | class for the `vxe-grid` node | `string` |
| `gridOptions` | `vxe-grid` options | `DeepPartial<VxeTableGridOptions>` |
| `gridEvents` | `vxe-grid` event handlers | `DeepPartial<VxeGridListeners>` |
| `formOptions` | search form options | `VbenFormProps` |
| `showSearchForm` | whether the search form is visible | `boolean` |
| `separator` | separator between the search form and table body | `boolean \| SeparatorOptions` |

## Slots

| Slot              | Description                                             |
| ----------------- | ------------------------------------------------------- |
| `toolbar-actions` | left side of the toolbar, near the title                |
| `toolbar-tools`   | right side of the toolbar, before built-in tool buttons |
| `table-title`     | custom table title                                      |

All named slots starting with `form-` are forwarded to the search form.
