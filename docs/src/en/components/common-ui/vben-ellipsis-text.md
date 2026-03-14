---
outline: deep
---

# Vben EllipsisText

`EllipsisText` displays long text with truncation, tooltip support, and optional expand/collapse behavior.

## Basic Usage

Pass the text through the default slot and limit the visual width with `maxWidth`.

<DemoPreview dir="demos/vben-ellipsis-text/line" />

## Current Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `expand` | allow click-to-expand behavior | `boolean` | `false` |
| `line` | max visible line count | `number` | `1` |
| `maxWidth` | max width of the text area | `number \| string` | `'100%'` |
| `placement` | tooltip placement | `'bottom' \| 'left' \| 'right' \| 'top'` | `'top'` |
| `tooltip` | enable tooltip | `boolean` | `true` |
| `tooltipWhenEllipsis` | only show tooltip when text is actually truncated | `boolean` | `false` |
| `ellipsisThreshold` | pixel threshold used when checking truncation | `number` | `3` |
| `tooltipBackgroundColor` | tooltip background color | `string` | `''` |
| `tooltipColor` | tooltip text color | `string` | `''` |
| `tooltipFontSize` | tooltip font size in px | `number` | `14` |
| `tooltipMaxWidth` | tooltip max width in px | `number` | - |
| `tooltipOverlayStyle` | tooltip content style | `CSSProperties` | `{ textAlign: 'justify' }` |

## Events

| Event | Description | Type |
| --- | --- | --- |
| `expandChange` | fired when expand state changes | `(isExpand: boolean) => void` |

## Slots

| Slot      | Description            |
| --------- | ---------------------- |
| `tooltip` | custom tooltip content |
