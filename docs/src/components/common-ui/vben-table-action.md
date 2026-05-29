---
outline: deep
---

# Vben TableAction 表格操作

`TableAction` 用于在表格操作列中渲染一组操作按钮，参考 vben2 的 TableAction 设计。基于 shadcn-ui 构建，支持权限控制、气泡确认、提示、下拉「更多」、分割线等能力，可在表格内外任意场景复用。

> 如果文档内没有覆盖到你需要的细节，可以结合在线示例一起查看。

::: info 写在前面

组件本身不依赖任何业务逻辑（不直接读取权限 store），权限通过注入 `hasPermission` 实现，从而保持核心层零耦合、可跨框架复用。在 vxe-table 中推荐通过列插槽（`slots: { default: 'action' }`）在页面里渲染，不改变表格原有的渲染机制。:::

## 基础用法

通过 `actions` 传入操作项数组，每项包含 `text`、`onClick` 等；`danger` 标记危险操作，`divider` 显示按钮间分割线。

<DemoPreview dir="demos/vben-table-action/basic" />

## 提示

通过 `tooltip` 为操作项添加提示，支持字符串或 `{ content, side }` 配置。

<DemoPreview dir="demos/vben-table-action/tooltip" />

## 气泡确认

通过 `popConfirm` 开启点击前的气泡确认，常用于删除等危险操作。

<DemoPreview dir="demos/vben-table-action/popconfirm" />

## 更多下拉

通过 `dropdownActions` 将次要操作收纳到「更多」下拉中，`moreText` 可自定义按钮文案。

<DemoPreview dir="demos/vben-table-action/dropdown" />

## 权限控制

为操作项设置 `auth` 权限码，并注入 `hasPermission` 判断函数，无权限的操作会被隐藏。

<DemoPreview dir="demos/vben-table-action/permission" />

## 在 vxe-table 中使用

不改变 vxe-table 原有渲染方式，推荐在列配置中声明插槽，在页面通过插槽渲染。

::: tip 推荐：使用适配器封装的版本项目的 `#/adapter/vxe-table` 已对 `VbenTableAction` 做了二次封装，内部统一注入了 `hasPermission`（基于 `useAccess().hasAccessByCodes`）。因此从适配器引入时**无需再传入 `:has-permission`**，只需通过操作项的 `auth` 字段声明权限码即可。:::

```ts
// data.ts —— 列配置声明插槽
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
<!-- list.vue —— 从适配器引入，权限自动注入，无需传入 has-permission -->
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

若直接从 `@vben/common-ui` 引入核心组件（不经过适配器），组件不依赖任何业务逻辑，需自行注入 `hasPermission`：

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

| 属性名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| actions | 主操作按钮 | `ActionItem[]` | `[]` |
| dropdownActions | 「更多」下拉中的操作 | `ActionItem[]` | `[]` |
| align | 对齐方式 | `'start' \| 'center' \| 'end'` | `'end'` |
| divider | 按钮之间是否显示分割线 | `boolean` | `false` |
| moreText | 「更多」按钮文案（提供时显示在图标右侧） | `string` | - |
| hasPermission | 权限判断函数，返回 `false` 则隐藏对应 `auth` 的操作（从 `#/adapter/vxe-table` 引入时已自动注入，无需手动传入） | `(auth?: string \| string[]) => boolean` | - |
| class | 根节点自定义类名 | `string` | - |

### ActionItem

| 属性名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| text | 按钮文本 | `string` | - |
| icon | 图标组件 | `string`\| `VbenIcon` | - |
| onClick | 点击回调 | `() => void` | - |
| auth | 权限码，配合 `hasPermission` 过滤 | `string \| string[]` | - |
| ifShow | 是否显示 | `boolean \| (() => boolean)` | `true` |
| disabled | 是否禁用 | `boolean` | `false` |
| loading | 加载状态 | `boolean` | `false` |
| danger | 危险操作（红色文字） | `boolean` | `false` |
| tooltip | 提示 | `string \| { content: string; side?: 'top' \| 'bottom' \| 'left' \| 'right' }` | - |
| popConfirm | 气泡确认 | `TableActionPopConfirm` | - |
| variant | 按钮样式变体 | `ButtonVariants['variant']` | `'link'` |
| size | 按钮尺寸 | `ButtonVariants['size']` | `'sm'` |
| key | 唯一标识 | `string \| number` | - |

### TableActionPopConfirm

| 属性名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 提示标题 | `string` | `'Are you sure?'` |
| okText | 确认按钮文案 | `string` | `'OK'` |
| cancelText | 取消按钮文案 | `string` | `'Cancel'` |
| confirm | 确认回调；未提供时回退到 `action.onClick` | `() => void` | - |
