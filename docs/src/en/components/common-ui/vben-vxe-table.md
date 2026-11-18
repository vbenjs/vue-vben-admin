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

## Search Form Separator & Segmented Layout

When a search form is enabled, a separator is rendered between the form and the table body by default. Customize or disable it with `separator`:

```ts
const [Grid] = useVbenVxeGrid({
  formOptions: {},
  gridOptions: {},
  separator: false,
  // separator: { show: false },
  // separator: { backgroundColor: 'rgba(100,100,0,0.5)' },
  // separator: { class: 'my-2 h-px rounded-full bg-primary/40' },
});
```

The separator is a decorative in-flow element. Styles compose in the order `preset class → user class → backgroundColor → user style`. The default band uses `h-2` (8px) at every breakpoint and has no vertical margins. `separator.fullBleed` (default `true` in the default mode) extends the separator across the `vxe-grid` padding; the bleed width is measured from the actual padding, so `gridClass` changes (e.g. `p-2` → `p-3`) and fullscreen are handled automatically.

### Segmented Layout

`segmented` splits the search form and the table body into two sections with independently customizable radius and background:

| Mode | Appearance | Upper section | Lower section | Separator |
| --- | --- | --- | --- | --- |
| `false` (default) | legacy full-bleed band | transparent form area | the card itself | full-bleed band |
| `zone` | one card, two zones | rounded in-card panel (`background-deep`) | the card itself | hidden by default; 1px hairline when enabled |
| `card` | two separate cards | standalone rounded card (`card` background) | standalone rounded card | hidden by default, cards separated by `gap` |

```ts
const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {},
  gridOptions: {},
  segmented: 'zone',
  // segmented: 'card',
  // sectionOptions: {
  //   body: { borderRadius: '12px' },
  //   form: { borderRadius: '12px' },
  //   gap: '12px',
  // },
});

// Switch at runtime (or pass as props to <Grid>)
gridApi.setState({ segmented: 'card' });
```

Companion props:

- `sectionOptions`: the single entry for section surfaces. `form` / `body` only expose `backgroundColor` and `borderRadius` (vertical padding/border/margin are deliberately not exposed — they are not covered by vxe's height calculation); `gap` is the two-card spacing (CSS length, defaults to `0.5rem`, negatives rejected); `fullscreenBackgroundColor` is the root background when a two-card grid is maximized (defaults to `background-deep`).
- `formClass`: class for the outer form surface (padding, background and radius), merged after the mode preset and also applied to a custom `form` slot. It targets a different element from `formOptions.wrapperClass` (field grid columns/gaps), `commonConfig.formItemClass` (fields), and `actionWrapperClass` (actions).
- Separator visibility in segmented modes: `false`/`true` decides directly; an object uses `show` when present; otherwise the mode default applies (the band is only shown by default in the default mode — the `zone` panel edge and the `card` layout already separate the sections, and an extra hairline would double the table header's own border line). When explicitly enabled in `card` mode, the separator zone adds `gap / 2` padding above and below the line; the card gap and the separator visibility are independent concerns. The separator has no vertical margins. Compact grid search forms use an 8px row gap instead of trailing field/action padding. Surfaces own the edge spacing: the default grid supplies the top/side inset and the form surface supplies the bottom inset; zone/card surfaces use 8px on all sides. Standalone forms retain their default spacing, and `compact: false` retains the 16px field space reserved for validation messages.

Section radii follow the theme `var(--radius)` by default.

**Two-card body padding**: the grid root has no padding, so both cards occupy the same outer bounds as other modes. The lower card carries a default `0.5rem` inset, including when the toolbar or pager is absent. Override `--vben-grid-body-padding` on any ancestor element to adjust it, or per instance via the `gridClass` arbitrary-property syntax:

```ts
// global (any ancestor CSS)
:root { --vben-grid-body-padding: 12px; }

// per instance
useVbenVxeGrid({ gridOptions: {}, segmented: 'card', gridClass: '[--vben-grid-body-padding:12px]' });
```

> Do not add vertical padding to the body wrapper to adjust the top/bottom inset — it is not covered by vxe's auto height calculation and will overflow or clip the table. The toolbar or `Top` wrapper supplies the top inset, and the pager or `Bottom` wrapper supplies the bottom inset. These wrappers are included in VXE's `offsetHeight` measurements. The default/zone modes also use `Top` to leave 8px between the band/panel and the table when no toolbar is rendered. Custom `layouts` that omit `Top` / `Bottom` also omit those fallback insets. The pager follows its content height (at least 28px), avoiding the extra space from the native mini fixed height.

### Layout Constraints

`zone` / `card` modes (or an explicit `sectionOptions.body`) validate the effective `layouts` (after merging global vxe config):

- the header contains only `Form`;
- the body contains exactly one `Table`; `Toolbar` / `Top` / `Bottom` / `Pager` may be trimmed or reordered;
- the footer is empty, and `Form` must not appear in the body.

Violations are reported as explicit console errors — disable segmented mode or adjust `layouts`. The pager is never moved silently. When only using the default `separator` feature, `layouts` passthrough keeps working as before.

### Size Changes

Layout-affecting changes (search form toggle, form collapse/expand, mode or config switches, validation messages) automatically trigger `grid.recalculate(true)`; the full-bleed width is re-measured on `gridClass`, fullscreen, and breakpoint changes. No manual recalculation or grid rebuild is required.

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
| `segmented` | segmented layout mode (`false` / `zone` / `card`) | `false \| 'card' \| 'zone'` |
| `sectionOptions` | section surfaces (background/radius for both sections, card gap, fullscreen background) | `GridSectionOptions` |
| `formClass` | class for the form surface (upper section) | `ClassType` |

## Slots

| Slot              | Description                                             |
| ----------------- | ------------------------------------------------------- |
| `toolbar-actions` | left side of the toolbar, near the title                |
| `toolbar-tools`   | right side of the toolbar, before built-in tool buttons |
| `table-title`     | custom table title                                      |

All named slots starting with `form-` are forwarded to the search form.
