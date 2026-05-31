---
outline: deep
---

# Vben Descriptions

`Descriptions` displays a group of read-only fields, commonly used on detail pages and information previews. It is built on shadcn-ui with an API modeled after Ant Design Vue's Descriptions, supporting responsive columns, column spanning, borders, and vertical layout.

> If the documentation does not cover the details you need, please refer to the online examples.

::: info Before you start

The component supports two usages: data-driven via `items` (recommended), or declaring entries with the `VbenDescriptionsItem` child component. `items` takes precedence when both are provided. :::

## Basic Usage

Pass an array of fields via `items`, each with a `label` and `content`. Columns adapt to breakpoints by default (1 column on `xs`, 2 on `sm`, 3 on `md` and above).

<DemoPreview dir="demos/vben-descriptions/basic" />

## Bordered

Set `bordered` for a bordered style, combined with the `title` prop and the `#extra` slot (an action area on the right of the title).

<DemoPreview dir="demos/vben-descriptions/bordered" />

## Vertical Layout

Use `layout="vertical"` to place labels above their content.

<DemoPreview dir="demos/vben-descriptions/vertical" />

## Sizes

Use `size` to switch between `small`, `middle`, and `large`.

<DemoPreview dir="demos/vben-descriptions/size" />

## Span & Responsive

Set `span` on an item to span multiple columns; `'filled'` fills the remaining space of the current row. `column` accepts a breakpoint-keyed object for responsive columns.

<DemoPreview dir="demos/vben-descriptions/span" />

## Child Component Usage

When `items` is omitted, declare entries with `VbenDescriptionsItem` in the default slot. Content can be customized via the default slot or the `#content` slot.

<DemoPreview dir="demos/vben-descriptions/custom" />

## API

### Descriptions Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| items | Data-driven entries; reads the default slot when omitted | `DescriptionsItemType[]` | - |
| bordered | Whether to show borders | `boolean` | `false` |
| column | Columns per row, supports breakpoint config | `number \| Partial<Record<Breakpoint, number>>` | `{ xs: 1, sm: 2, md: 3, xxxl: 4 }` |
| layout | Layout direction | `'horizontal' \| 'vertical'` | `'horizontal'` |
| size | Size | `'small' \| 'middle' \| 'large'` | `'middle'` |
| colon | Show colon (only for non-bordered horizontal layout) | `boolean` | `true` |
| title | Title | `string` | - |
| extra | Action area on the right of the title | `string` | - |
| labelStyle | Shared label style | `CSSProperties` | - |
| contentStyle | Shared content style | `CSSProperties` | - |
| class | Custom class for the root node | `string` | - |

### Descriptions Slots

| Slot    | Description                           |
| ------- | ------------------------------------- |
| title   | Custom title                          |
| extra   | Custom action area beside the title   |
| default | Place `VbenDescriptionsItem` children |

### DescriptionsItem

Each entry in `items`, or the props of the `VbenDescriptionsItem` child component.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| label | Label | `string \| number \| (() => VNode) \| Component` | - |
| content | Content | `string \| number \| (() => VNode) \| Component` | - |
| span | Columns to span, `'filled'` fills the rest of the row | `number \| 'filled' \| Partial<Record<Breakpoint, number>>` | `1` |
| labelStyle | Label style | `CSSProperties` | - |
| contentStyle | Content style | `CSSProperties` | - |
| key | Unique key | `string \| number` | - |

### DescriptionsItem Slots

Available only for the child component usage.

| Slot    | Description                       |
| ------- | --------------------------------- |
| default | Content (equivalent to `content`) |
| content | Custom content                    |
| label   | Custom label                      |

::: tip Breakpoint

The responsive `Breakpoint` is one of `'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl'`, with pixel values aligned with Ant Design (`sm` 576, `md` 768, `lg` 992, `xl` 1200, `xxl` 1600, `xxxl` 2000). :::
