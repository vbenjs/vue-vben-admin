---
outline: deep
---

# Vben Vxe Table 表格

框架提供的Table 列表组件基于 [vxe-table](https://vxetable.cn/v4/#/grid/api?apiKey=grid)，结合`Vben Form 表单`进行了二次封装。

其中，表头的 **表单搜索** 部分采用了`Vben Form表单`，表格主体部分使用了`vxe-grid`组件，支持表格的分页、排序、筛选等功能。

> 如果文档内没有参数说明，可以尝试在在线示例或者在 [vxe-grid 官方API 文档](https://vxetable.cn/v4/#/grid/api?apiKey=grid) 内寻找

::: info 写在前面

如果你觉得现有组件的封装不够理想，或者不完全符合你的需求，大可以直接使用原生组件，亦或亲手封装一个适合的组件。框架提供的组件并非束缚，使用与否，完全取决于你的需求与自由。

:::

::: tip README

下方示例代码中的，存在一些国际化、主题色未适配问题，这些问题只在文档内会出现，实际使用并不会有这些问题，可忽略，不必纠结。

:::

## 基础表格

使用 `useVbenVxeGrid` 创建最基础的表格。

<DemoPreview dir="demos/vben-vxe-table/basic" />

## 远程加载

通过指定 `proxyConfig.ajax` 的 `query` 方法，可以实现远程加载数据。

<DemoPreview dir="demos/vben-vxe-table/remote" />

## 树形表格

树形表格，的数据源为扁平结构，可以指定`treeConfig`配置项，实现树形表格。

```typescript
treeConfig: {
  transform: true, // 指定表格为树形表格
  parentField: 'parentId', // 父节点字段名
  rowField: 'id', // 行数据字段名
},
```

<DemoPreview dir="demos/vben-vxe-table/tree" />

## 固定表头/列

列固定可选参数： `'left' | 'right' | '' | null`

<DemoPreview dir="demos/vben-vxe-table/fixed" />

## 自定义单元格

自定义单元格有两种实现方式

- 通过 `slots` 插槽
- 通过 `customCell` 自定义单元格，但是要先添加渲染器

```typescript
// 表格配置项可以用 cellRender: { name: 'CellImage' },
vxeUI.renderer.add('CellImage', {
  renderDefault(_renderOpts, params) {
    const { column, row } = params;
    return h(Image, { src: row[column.field] } as any); // 注意此处的Image 组件，来源于Antd，需要自行引入,否则会使用js的Image类
  },
});

// 表格配置项可以用 cellRender: { name: 'CellLink' },
vxeUI.renderer.add('CellLink', {
  renderDefault(renderOpts) {
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

**表单搜索** 部分采用了`Vben Form 表单`，参考 [Vben Form 表单文档](/components/common-ui/vben-form)。

<DemoPreview dir="demos/vben-vxe-table/form" />

## 单元格编辑

通过指定`editConfig.mode`为`cell`，可以实现单元格编辑。

<DemoPreview dir="demos/vben-vxe-table/edit-cell" />

## 行编辑

通过指定`editConfig.mode`为`row`，可以实现行编辑。

<DemoPreview dir="demos/vben-vxe-table/edit-row" />

## 虚拟滚动

通过 scroll-y.enabled 与 scroll-y.gt 组合开启，其中 enabled 为总开关，gt 是指当总行数大于指定行数时自动开启。

> 参考 [vxe-table 官方文档 - 虚拟滚动](https://vxetable.cn/v4/#/component/grid/scroll/vertical)。

<DemoPreview dir="demos/vben-vxe-table/virtual" />
