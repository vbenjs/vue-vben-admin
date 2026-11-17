---
outline: deep
---

# Vben Vxe Table 表格

`Vben Vxe Table` 基于 [vxe-table](https://vxetable.cn/v4/#/grid/api?apiKey=grid) 和 `Vben Form` 做了二次封装，用于构建带搜索表单的列表页面。

> 如果文档内没有覆盖到你需要的细节，可以结合在线示例和 [vxe-grid 官方 API](https://vxetable.cn/v4/#/grid/api?apiKey=grid) 一起查看。

::: info 写在前面

如果现有封装不满足你的场景，可以直接使用原生 `vxe-table` 能力，或者在适配层中继续扩展。

:::

## 适配器

底层表格基于 `vxe-table`，每个应用都可以在自己的适配层中配置默认行为、自定义渲染器以及与 UI 组件库的集成。

### 适配器示例

::: details vxe-table 表格适配器

```ts
import { h } from 'vue';

import { setupVbenVxeTable, useVbenVxeGrid } from '@vben/plugins/vxe-table';

import { Button, Image } from 'antdv-next';

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
  // separator: { class: 'my-2 h-px bg-primary/40 rounded-full' },
});
```

分隔条是文档流内的装饰性元素（`aria-hidden`），样式按 “预设 class → 用户 `class` → `backgroundColor` → 用户 `style`” 依次合成：

- `separator.class`：工具类会按 tailwind-merge 规则覆盖同名预设；默认色带在所有断点均为 `h-2`（8px），不带上下外边距；
- `separator.fullBleed`：是否扩展到 `vxe-grid` 内边距外沿（通栏）。默认形态为 `true`，通栏宽度按 `gridClass` 实际内边距自动测量（`p-2`/`p-3`/全屏切换都会自动更新），其余分段模式为 `false`。

### 分段布局

`segmented` 用于将搜索表单与表格主体拆分为两个可独立定制圆角、背景的区段，共三种形态：

| 模式 | 外观 | 上段 | 下段 | 分隔条 |
| --- | --- | --- | --- | --- |
| `false`（默认） | 原有通栏色带 | 透明表单区 | 卡片本身 | 通栏色带（`fullBleed`） |
| `zone` | 单卡双区 | 卡内圆角面板（`background-deep`） | 卡片本身 | 默认隐藏，显式开启为 1px 细线 |
| `card` | 双独立卡片 | 独立圆角卡片（`card` 背景） | 独立圆角卡片 | 默认隐藏，两卡以 `gap` 间隔 |

```ts
const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {},
  gridOptions: {},
  // 单卡双区
  segmented: 'zone',
  // 双独立卡片 + 自定义两卡圆角与间距
  // segmented: 'card',
  // sectionOptions: { body: { borderRadius: '12px' }, form: { borderRadius: '12px' }, gap: '12px' },
});

// 运行时切换（也可直接作为 <Grid> 的 props 传入）
gridApi.setState({ segmented: 'card' });
```

配套属性：

- `sectionOptions`：两段表面的统一入口。`form` / `body` 仅开放 `backgroundColor` 与 `borderRadius`（垂直 padding/border/margin 不在 vxe 的高度计算范围内，刻意不开放）；`gap` 为双卡间距（CSS 长度，默认 `0.5rem`，不接受负数）；`fullscreenBackgroundColor` 为双卡全屏时的根节点底色（默认 `background-deep`）。
- `formClass`：表单外层表面（上段）的 class，用于 padding、背景、圆角，按 “模式预设 → `formClass`” 合并，也作用于自定义 `form` slot。它不替代 `formOptions.wrapperClass`（字段栅格的列数/间距）、`commonConfig.formItemClass`（字段）或 `actionWrapperClass`（按钮组）；这些选项作用于不同节点。
- `separator` 在分段模式下的显隐规则：`false`/`true` 直接决定显隐；对象有 `show` 用 `show`；否则使用模式默认值（仅默认形态显示色带；`zone` 的深色面板边缘与 `card` 的双卡布局自身已构成分隔，且叠加细线会与表格头自带边线形成双线，故默认隐藏）。显式开启时，分隔区在线的上下各使用 `gap / 2` 的内边距（`card`），两卡间距与分隔条显隐相互独立。分隔条自身不带上下外边距。默认紧凑搜索表单以 8px 行间距替代字段/按钮组尾部的 `pb-2`，面板负责边缘留白，默认、zone、card 均按 8px 基准组织。默认形态的顶部/左右由 grid 提供，表面只补底部；zone/card 表面四周均为 8px。独立 Form 的默认间距不变；`compact: false` 保留校验消息所需的 16px 字段底部空间。

> 两段圆角默认跟随主题 `var(--radius)`，通过主题配置修改圆角时两段会同步变化。

**双卡下段内边距**：双卡的根节点默认无 padding，两张卡片与其他布局占据相同外廓。下段卡片默认带 `0.5rem` 内边距，表格边线不会贴卡片边缘；没有工具栏或分页器时仍保留上下留白。可在任意祖先元素上覆盖 `--vben-grid-body-padding` 快速调整，也可按实例经 `gridClass` 任意属性语法设置：

```ts
// 全局(任意祖先 CSS)
:root { --vben-grid-body-padding: 12px; }

// 单实例
useVbenVxeGrid({ gridOptions: {}, segmented: 'card', gridClass: '[--vben-grid-body-padding:12px]' });
```

> 注意:不要通过给 body wrapper 设置垂直 padding 的方式调整上下内边距——它不在 vxe 的 auto 高度计算范围内，会导致表格溢出或裁切。顶部由工具栏或 `Top` wrapper 提供，底部由分页或 `Bottom` wrapper 提供，均计入 vxe 测量的 `offsetHeight`。默认/zone 在有分隔条或表单面板、但无工具栏时，也通过 `Top` 保留到表头的 8px 留白。自定义 `layouts` 如果移除 `Top` / `Bottom`，也会移除对应的无工具栏/无分页留白入口。分页器高度跟随内容（至少 28px），不再叠加原生 mini 的固定高度留白。

#### 布局边界

`zone` / `card` 模式（或显式配置 `sectionOptions.body` 时）依赖 vxe 的默认布局结构，对合并全局配置后的有效 `layouts` 做了约束：

- header 只包含 `Form`；
- body 包含唯一的 `Table`，`Toolbar` / `Top` / `Bottom` / `Pager` 可按需删减或排序；
- footer 为空，且 `Form` 不允许出现在 body 中。

不符合约束时会在控制台输出明确的配置错误提示，此时应关闭分段模式或调整 `layouts`。组件不会静默搬动分页条，也不会回退为错误的外观。仅使用默认 `separator` 功能（不分段）时，`layouts` 透传能力保持不变。

#### 尺寸变化

分段相关的高度变化（搜索表单显隐、表单收起/展开、模式或配置切换、校验提示）会自动触发 `grid.recalculate(true)` 重新计算表格布局；通栏分隔条的扩展宽度随 `gridClass` 内边距、全屏状态与断点变化自动重测。无需手动重算或重建表格。

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
| segmented | 分段模式（`false` / `zone` / `card`） | `false \| 'card' \| 'zone'` | - |
| sectionOptions | 分段表面配置（两段背景/圆角、双卡间距、全屏底色） | `GridSectionOptions` | - |
| formClass | 表单表面（上段）class | `ClassType` | - |

## Slots

大部分插槽说明可参考 [vxe-table 官方文档](https://vxetable.cn/v4/#/grid/api)，这里列出封装层新增或约定的部分。

| 插槽名          | 描述                                 |
| --------------- | ------------------------------------ |
| toolbar-actions | 工具栏左侧区域，位于标题附近         |
| toolbar-tools   | 工具栏右侧区域，位于内置工具按钮左侧 |
| table-title     | 自定义表格标题                       |

::: info 搜索表单插槽

当启用了搜索表单时，所有以 `form-` 开头的具名插槽都会被转发给表单。:::
