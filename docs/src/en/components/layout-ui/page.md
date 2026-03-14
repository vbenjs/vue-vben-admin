---
outline: deep
---

# Page

`Page` is the standard top-level layout container for business pages. It provides a header area, a content area, and an optional footer area.

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `title` | page title | `string \| slot` | - |
| `description` | page description | `string \| slot` | - |
| `contentClass` | class for the content area | `string` | - |
| `headerClass` | class for the header area | `string` | - |
| `footerClass` | class for the footer area | `string` | - |
| `autoContentHeight` | auto-calculate the content area height from the visible layout height | `boolean` | `false` |
| `heightOffset` | extra height offset subtracted from the content area when auto height is enabled | `number` | `0` |

## Slots

| Slot          | Description               |
| ------------- | ------------------------- |
| `default`     | page content              |
| `title`       | custom title              |
| `description` | custom description        |
| `extra`       | right-side header content |
| `footer`      | footer content            |
