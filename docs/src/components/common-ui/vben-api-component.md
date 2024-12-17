---
outline: deep
---

# Vben ApiComponent Api组件包装器

框架提供的API“包装器”，它一般不独立使用，主要用于包装其它组件，为目标组件提供自动获取远程数据的能力，但仍然保持了目标组件的原始用法。

::: info 写在前面

我们在各个应用的组件适配器中，使用ApiComponent包装了Select、TreeSelect组件，使得这些组件可以自动获取远程数据并生成选项。其它类似的组件（比如Cascader）如有需要也可以参考示例代码自行进行包装。

:::

## 基础用法

通过 `component` 传入其它组件的定义，并配置相关的其它属性（主要是一些名称映射）。包装组件将通过`api`获取数据（`beforerFetch`、`afterFetch`将分别在`api`运行前、运行后被调用），使用`resultField`从中提取数组，使用`valueField`、`labelField`等来从数据中提取value和label（如果提供了`childrenField`，会将其作为树形结构递归处理每一级数据），之后将处理好的数据通过`optionsPropName`指定的属性传递给目标组件。

::: details 包装级联选择器,点击下拉时开始加载远程数据

```vue
<script lang="ts" setup>
import { ApiComponent } from '@vben/common-ui';

import { Cascader } from 'ant-design-vue';

const treeData: Record<string, any> = [
  {
    label: '浙江',
    value: 'zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: '杭州',
        children: [
          {
            value: 'xihu',
            label: '西湖',
          },
          {
            value: 'sudi',
            label: '苏堤',
          },
        ],
      },
      {
        value: 'jiaxing',
        label: '嘉兴',
        children: [
          {
            value: 'wuzhen',
            label: '乌镇',
          },
          {
            value: 'meihuazhou',
            label: '梅花洲',
          },
        ],
      },
      {
        value: 'zhoushan',
        label: '舟山',
        children: [
          {
            value: 'putuoshan',
            label: '普陀山',
          },
          {
            value: 'taohuadao',
            label: '桃花岛',
          },
        ],
      },
    ],
  },
  {
    label: '江苏',
    value: 'jiangsu',
    children: [
      {
        value: 'nanjing',
        label: '南京',
        children: [
          {
            value: 'zhonghuamen',
            label: '中华门',
          },
          {
            value: 'zijinshan',
            label: '紫金山',
          },
          {
            value: 'yuhuatai',
            label: '雨花台',
          },
        ],
      },
    ],
  },
];
/**
 * 模拟请求接口
 */
function fetchApi(): Promise<Record<string, any>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(treeData);
    }, 1000);
  });
}
</script>
<template>
  <ApiComponent
    :api="fetchApi"
    :component="Cascader"
    :immediate="false"
    children-field="children"
    loading-slot="suffixIcon"
    visible-event="onDropdownVisibleChange"
  />
</template>
```

:::

## API

### Props

| 属性名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| component | 欲包装的组件 | `Component` | - |
| numberToString | 是否将value从数字转为string | `boolean` | `false` |
| api | 获取数据的函数 | `(arg?: any) => Promise<OptionsItem[] \| Record<string, any>>` | - |
| params | 传递给api的参数 | `Record<string, any>` | - |
| resultField | 从api返回的结果中提取options数组的字段名 | `string` | - |
| labelField | label字段名 | `string` | `label` |
| childrenField | 子级数据字段名，需要层级数据的组件可用 | `string` | `` |
| valueField | value字段名 | `string` | `value` |
| optionsPropName | 组件接收options数据的属性名称 | `string` | `options` |
| modelPropName | 组件的双向绑定属性名，默认为modelValue。部分组件可能为value | `string` | `modelValue` |
| immediate | 是否立即调用api | `boolean` | `true` |
| alwaysLoad | 每次`visibleEvent`事件发生时都重新请求数据 | `boolean` | `false` |
| beforeFetch | 在api请求之前的回调函数 | `AnyPromiseFunction<any, any>` | - |
| afterFetch | 在api请求之后的回调函数 | `AnyPromiseFunction<any, any>` | - |
| options | 直接传入选项数据，也作为api返回空数据时的后备数据 | `OptionsItem[]` | - |
| visibleEvent | 触发重新请求数据的事件名 | `string` | - |
| loadingSlot | 组件的插槽名称，用来显示一个"加载中"的图标 | `string` | - |

```

```
