---
outline: deep
---

# Vben Vxe Table 表格

`Vben Vxe Table` 基于 [vxe-table](https://vxetable.cn/v4/#/grid/api?apiKey=grid) 和 `Vben Form` 做了二次封装，用于构建带搜索表单的列表页面。

> 如果文档内没有覆盖到你需要的细节，可以结合在线示例和 [vxe-grid 官方 API](https://vxetable.cn/v4/#/grid/api?apiKey=grid) 一起查看。

::: info 写在前面

如果现有封装不满足你的场景，可以直接使用原生 `vxe-table` 能力，或者在适配层中继续扩展。:::

## 适配器

底层表格基于 `vxe-table`，每个应用都可以在自己的适配层中配置默认行为、自定义渲染器以及与 UI 组件库的集成。

### 适配器示例

::: details vxe-table 表格适配器

```ts
import { h } from 'vue';

import { setupVbenVxeTable, useVbenVxeGrid } from '@vben/plugins/vxe-table';

import { Button, Image } from 'ant-design-vue';

import { useVbenForm } from './form';

setupVbenVxeTable({
  configVxeTable: (vxeUI) => {
    vxeUI.setConfig({
      grid: {
        align: 'center',
        border: false,
        columnConfig: {
          resizable: true,
        },
        minHeight: 180,
        formConfig: {
          enabled: false,
        },
        proxyConfig: {
          autoLoad: true,
          response: {
            result: 'items',
            total: 'total',
            list: 'items',
          },
          showActiveMsg: true,
          showResponseMsg: false,
        },
        round: true,
        showOverflow: true,
        size: 'small',
      },
    });

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
  },
  useVbenForm,
});

export { useVbenVxeGrid };

export type * from '@vben/plugins/vxe-table';
```

:::

## 基础表格

通过 `useVbenVxeGrid` 创建一个基础表格。

<DemoPreview dir="demos/vben-vxe-table/basic" />

## 远程加载

通过配置 `proxyConfig.ajax.query` 实现远程数据加载。

<DemoPreview dir="demos/vben-vxe-table/remote" />

## 树形表格

树形表格的数据源通常是扁平结构，可以通过 `treeConfig` 转换为树形展示。

```ts
treeConfig: {
  transform: true,
  parentField: 'parentId',
  rowField: 'id',
},
```

<DemoPreview dir="demos/vben-vxe-table/tree" />

## 固定列

固定列可选值为 `'left' | 'right' | '' | null`。

<DemoPreview dir="demos/vben-vxe-table/fixed" />

## 自定义单元格

可以通过插槽或自定义渲染器实现单元格定制。

```ts
vxeUI.renderer.add('CellImage', {
  renderTableDefault(_renderOpts, params) {
    const { column, row } = params;
    return h(Image, { src: row[column.field] } as any);
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

<DemoPreview dir="demos/vben-vxe-table/custom-cell" />

## 搜索表单

搜索区域底层使用的是 `Vben Form`。启用搜索表单后，可以通过 `gridOptions.toolbarConfig.search = true` 在工具栏中显示搜索面板开关按钮。

所有以 `form-` 开头的具名插槽都会自动转发到搜索表单。

### 自定义分隔条

启用搜索表单时，表单和表格主体之间默认会显示一个分隔条。可以通过 `separator` 调整或关闭它。

```ts
const [Grid] = useVbenVxeGrid({
  formOptions: {},
  gridOptions: {},
  separator: false,
  // separator: { show: false },
  // separator: { backgroundColor: 'rgba(100,100,0,0.5)' },
});
```

<DemoPreview dir="demos/vben-vxe-table/form" />

## 单元格编辑

通过设置 `editConfig.mode = 'cell'` 开启单元格编辑。

<DemoPreview dir="demos/vben-vxe-table/edit-cell" />

## 行编辑

通过设置 `editConfig.mode = 'row'` 开启整行编辑。

<DemoPreview dir="demos/vben-vxe-table/edit-row" />

## 虚拟滚动

通过 `scroll-y.enabled` 和 `scroll-y.gt` 组合开启纵向虚拟滚动。

> 参考 [vxe-table 官方文档 - 虚拟滚动](https://vxetable.cn/v4/#/component/grid/scroll/vertical)

<DemoPreview dir="demos/vben-vxe-table/virtual" />

## API

`useVbenVxeGrid` 返回一个数组，第一个元素是表格组件，第二个元素是表格 API。

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

### GridApi

| 方法名 | 描述 | 类型 | 说明 |
| --- | --- | --- | --- |
| setLoading | 设置 loading 状态 | `(loading: boolean) => void` | - |
| setGridOptions | 更新 `gridOptions` | `(options: Partial<VxeGridProps['gridOptions']>) => void` | - |
| reload | 重新加载表格，并重置到初始分页 | `(params?: Record<string, any>) => void` | - |
| query | 重新查询表格，保留当前分页 | `(params?: Record<string, any>) => void` | - |
| grid | `vxe-grid` 实例 | `VxeGridInstance` | - |
| formApi | 搜索表单 API 实例 | `FormApi` | - |
| toggleSearchForm | 切换或指定搜索表单显示状态 | `(show?: boolean) => boolean` | 传入参数时强制设置；不传参数时在显示和隐藏之间切换，并返回当前状态 |

## Props

所有属性都通过 `useVbenVxeGrid` 的第一个参数传入。

| 属性名 | 描述 | 类型 | 版本要求 |
| --- | --- | --- | --- |
| tableTitle | 表格标题 | `string` | - |
| tableTitleHelp | 表格标题帮助信息 | `string` | - |
| class | 外层容器的 class | `string` | - |
| gridClass | `vxe-grid` 的 class | `string` | - |
| gridOptions | `vxe-grid` 配置 | `DeepPartial<VxeTableGridOptions>` | - |
| gridEvents | `vxe-grid` 事件 | `DeepPartial<VxeGridListeners>` | - |
| formOptions | 搜索表单配置 | `VbenFormProps` | - |
| showSearchForm | 是否显示搜索表单 | `boolean` | - |
| separator | 搜索表单与表格主体之间的分隔条 | `boolean \| SeparatorOptions` | `>5.5.4` |

## Slots

大部分插槽说明可参考 [vxe-table 官方文档](https://vxetable.cn/v4/#/grid/api)，这里列出封装层新增或约定的部分。

| 插槽名          | 描述                                 |
| --------------- | ------------------------------------ |
| toolbar-actions | 工具栏左侧区域，位于标题附近         |
| toolbar-tools   | 工具栏右侧区域，位于内置工具按钮左侧 |
| table-title     | 自定义表格标题                       |

::: info 搜索表单插槽

当启用了搜索表单时，所有以 `form-` 开头的具名插槽都会被转发给表单。:::
