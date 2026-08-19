---
outline: deep
---

# 工具

::: tip 前言

`@vben/utils` 是多个 `app` 共用的工具包。它通过重新导出（re-export）继承了 `@vben-core/shared` 的 `cache`、`color`、`utils` 三个子模块的全部能力，并在其上补充了 UI 等业务工具。

:::

::: tip

`@vben/utils` 已在各 `app` 下统一引入，无需单独安装。`@vben-core/shared/constants` 子模块**未**被重新导出，其导出（如 `ELEMENT_ID_LAYOUT_SCROLL`）需直接从 `@vben-core/shared/constants` 引入。

:::

## 日期

### 格式化日期

`formatDate`：按 dayjs 格式化日期。`time` 支持 `Date` / `Dayjs` / `number` / `string`；空值返回 `''`；解析失败回退为 `String(time)`。结果按当前时区输出。

```ts
import { formatDate } from '@vben/utils';

formatDate('2024-01-01'); // '2024-01-01'
formatDate(new Date(), 'YYYY/MM/DD'); // '2024/01/01'
formatDate(undefined); // ''
```

### 格式化日期时间

`formatDateTime`：等价于 `formatDate(time, 'YYYY-MM-DD HH:mm:ss')`。

```ts
import { formatDateTime } from '@vben/utils';

formatDateTime(new Date('2024-01-01T12:34:56')); // '2024-01-01 12:34:56'
```

### 判断 Date 实例

`isDate`：类型守卫，判断是否为 `Date` 实例。

```ts
import { isDate } from '@vben/utils';

isDate(new Date()); // true
isDate('2024-01-01'); // false
```

### 判断 dayjs 实例

`isDayjsObject`：类型守卫，判断是否为 dayjs 实例。

```ts
import { isDayjsObject } from '@vben/utils';
import dayjs from 'dayjs';

isDayjsObject(dayjs()); // true
isDayjsObject(new Date()); // false
```

## 数组比较

### 数组相等比较

`arraysEqual`：比较两个数组是否相等（忽略顺序，按元素计数）。

```ts
import { arraysEqual } from '@vben/utils';

arraysEqual([1, 2], [2, 1]); // true
arraysEqual([1, 2], [1, 2, 3]); // false
```

### 数组严格比较

`arraysStrictEqual`：比较两个数组是否严格相等（顺序敏感）。

```ts
import { arraysStrictEqual } from '@vben/utils';

arraysStrictEqual([1, 2], [2, 1]); // false
arraysStrictEqual([1, 2], [1, 2]); // true
```

## 对象差异

### 对象差异比较

`diff`：深度对比两个对象，返回差异对象（仅含变化的字段），数组比较忽略顺序。

```ts
import { diff } from '@vben/utils';

diff({ a: 1, b: 2 }, { a: 1, b: 3 }); // { b: 3 }
diff({ list: [1, 2] }, { list: [2, 1] }); // {} (忽略顺序，无差异)
```

### 对象严格差异比较

`diffStrict`：深度对比两个对象，数组比较顺序敏感。

```ts
import { diffStrict } from '@vben/utils';

diffStrict({ a: [1, 2] }, { a: [2, 1] }); // { a: [2, 1] }
```

## 文件下载

### 按 URL 下载文件

`downloadFileFromUrl`：通过 URL 下载，支持跨域。Chrome/Safari 用 `<a download>` 触发；其余浏览器走 `openWindow`。仅当 `source` 为 falsy 或非字符串时抛错；不校验 URL 语法。

```ts
import { downloadFileFromUrl } from '@vben/utils';

await downloadFileFromUrl({ source: 'https://example.com/file.pdf' });
await downloadFileFromUrl({
  source: 'https://example.com/report.pdf',
  fileName: 'report.pdf',
});
```

### 按 Base64 下载文件

`downloadFileFromBase64`：通过 Base64 数据触发下载。

```ts
import { downloadFileFromBase64 } from '@vben/utils';

downloadFileFromBase64({
  source: 'data:text/plain;base64,aGVsbG8=',
  fileName: 'hello.txt',
});
```

### 按图片 URL 下载

`downloadFileFromImageUrl`：先用 `urlToBase64` 把图片 URL 转成 Base64，再下载。

```ts
import { downloadFileFromImageUrl } from '@vben/utils';

await downloadFileFromImageUrl({
  source: 'https://example.com/logo.png',
  fileName: 'logo.png',
});
```

### 按 Blob 下载文件

`downloadFileFromBlob`：通过 `Blob` 触发下载（创建 Object URL）。非 `Blob` 入参抛 `TypeError`。

```ts
import { downloadFileFromBlob } from '@vben/utils';

downloadFileFromBlob({
  source: new Blob(['hello'], { type: 'text/plain' }),
  fileName: 'hello.txt',
});
```

### 按 BlobPart 下载文件

`downloadFileFromBlobPart`：下载 BlobPart 类型数据；非 `Blob` 会被包成 `application/octet-stream` 的 Blob 再下载。

```ts
import { downloadFileFromBlobPart } from '@vben/utils';

downloadFileFromBlobPart({ source: ['hello', 'world'], fileName: 'data.txt' });
```

### 图片 URL 转 Base64

`urlToBase64`：通过 canvas 将图片 URL 转为 Base64 dataURL（默认 `image/png`）。

```ts
import { urlToBase64 } from '@vben/utils';

const dataURL = await urlToBase64('https://example.com/logo.png');
// 'data:image/png;base64,iVBORw0KGgo...'
```

### 触发下载

`triggerDownload`：插入隐藏 `<a>`、点击、移除，并在 `revokeDelay` 毫秒后 `URL.revokeObjectURL` 释放内存。

```ts
import { triggerDownload } from '@vben/utils';

triggerDownload('https://example.com/file.pdf', 'file.pdf');
```

## 类型判断

### 判断 undefined

`isUndefined`：是否为 `undefined`。

```ts
import { isUndefined } from '@vben/utils';

isUndefined(undefined); // true
isUndefined(null); // false
```

### 判断布尔值

`isBoolean`：是否为布尔值。

```ts
import { isBoolean } from '@vben/utils';

isBoolean(true); // true
isBoolean(0); // false
```

### 判断空值

`isEmpty`：是否为空：`null` / `undefined` / 空串 / 长度为 0 的数组 / 空 Map、Set / 无属性对象。

```ts
import { isEmpty } from '@vben/utils';

isEmpty(''); // true
isEmpty([]); // true
isEmpty({}); // true
isEmpty(null); // true
isEmpty('a'); // false
```

### 判断 HTTP URL

`isHttpUrl`：是否以 `http://` 或 `https://` 开头。

```ts
import { isHttpUrl } from '@vben/utils';

isHttpUrl('https://a.com'); // true
isHttpUrl('/api/user'); // false
```

### 判断 window 对象

`isWindow`：是否为 `window` 对象。

```ts
import { isWindow } from '@vben/utils';

isWindow(window); // true
isWindow(document); // false
```

### 判断 macOS 环境

`isMacOs`：当前环境是否为 macOS（依据 userAgent）。

```ts
import { isMacOs } from '@vben/utils';

isMacOs(); // macOS 下返回 true
```

### 判断 Windows 环境

`isWindowsOs`：当前环境是否为 Windows。

```ts
import { isWindowsOs } from '@vben/utils';

isWindowsOs(); // Windows 下返回 true
```

### 判断数字

`isNumber`：是否为有限数字。

```ts
import { isNumber } from '@vben/utils';

isNumber(1); // true
isNumber(Infinity); // false
isNumber('1'); // false
```

### 判断函数

`isFunction`：来自 `@vue/shared` 的类型守卫。

```ts
import { isFunction } from '@vben/utils';

isFunction(() => {}); // true
isFunction('fn'); // false
```

### 判断对象

`isObject`：来自 `@vue/shared` 的类型守卫。

```ts
import { isObject } from '@vben/utils';

isObject({}); // true
isObject([1]); // true
isObject(null); // false
```

### 判断字符串

`isString`：来自 `@vue/shared` 的类型守卫。

```ts
import { isString } from '@vben/utils';

isString('a'); // true
isString(1); // false
```

### 取首个非空值

`getFirstNonNullOrUndefined`：返回入参列表中第一个非 `null`、非 `undefined` 的值，全部为空时返回 `undefined`。

```ts
import { getFirstNonNullOrUndefined } from '@vben/utils';

getFirstNonNullOrUndefined(undefined, null, 42, 'hello'); // 42
getFirstNonNullOrUndefined(undefined, null); // undefined
```

## 字符串转换

### 首字母大写

`capitalizeFirstLetter`：首字母大写。

```ts
import { capitalizeFirstLetter } from '@vben/utils';

capitalizeFirstLetter('abc'); // 'Abc'
```

### 首字母小写

`toLowerCaseFirstLetter`：首字母小写。

```ts
import { toLowerCaseFirstLetter } from '@vben/utils';

toLowerCaseFirstLetter('Abc'); // 'abc'
```

### 转驼峰键名

`toCamelCase`：生成驼峰键名（无父级时返回 `key`，否则拼接父级 + 首字母大写子键）。

```ts
import { toCamelCase } from '@vben/utils';

toCamelCase('name'); // 'name'
toCamelCase('name', 'user'); // 'userName'
```

### kebab 转驼峰

`kebabToCamelCase`：kebab-case 转 camelCase。

```ts
import { kebabToCamelCase } from '@vben/utils';

kebabToCamelCase('my-var-name'); // 'myVarName'
```

## 加载脚本

`loadScript`：动态加载 JS 文件，已存在同 `src` 的 `<script>` 时直接 resolve；加载失败 reject。

```ts
import { loadScript } from '@vben/utils';

await loadScript('https://cdn.example.com/lib.js');
```

## 异步与流程控制

### 栈结构

`Stack`：栈数据结构。`dedup` 为 `true` 时入栈自动去重（移除旧位置）；`maxSize` 限制最大容量，超出则丢弃最早元素。

```ts
import { Stack } from '@vben/utils';

const stack = new Stack<string>(true, 3);
stack.push('a', 'b', 'c');
stack.push('a'); // 去重后栈为 ['b', 'c', 'a']
stack.peek(); // 'a'
stack.pop(); // 'a'
stack.size; // 2
stack.toArray(); // ['b', 'c']
```

### 创建栈

`createStack`：工厂函数，等价于 `new Stack(...)`。

```ts
import { createStack } from '@vben/utils';

const stack = createStack<string>(false, 5);
stack.push('a', 'b');
stack.toArray(); // ['a', 'b']
```

## Promise 转 err/data 元组

`to`：把 Promise 转成 Go 风格的 `[err, data]` 元组。失败时若传入 `errorExt`，会合并到错误对象上。

```ts
import { to } from '@vben/utils';

const [err, data] = await to(fetchUser(id));
if (err) return;
console.log(data);
```

## 树形遍历

### 遍历树收集值

`traverseTreeValues`：深度遍历，收集每个节点经 `getValue` 映射后的值，过滤掉 falsy 值。

```ts
import { traverseTreeValues } from '@vben/utils';

const tree = [{ id: 1, children: [{ id: 2 }] }];
traverseTreeValues(tree, (n) => n.id); // [1, 2]
```

### 过滤树

`filterTree`：按条件过滤树节点，保留命中节点（含命中子节点），原顺序返回。**会修改入参树**。

```ts
import { filterTree } from '@vben/utils';

const tree = [{ id: 1, children: [{ id: 2 }] }];
filterTree(tree, (n) => n.id === 1); // 保留 id=1 节点
```

### 映射树

`mapTree`：递归映射树节点。`mapper` 接收当前节点与父节点，返回新节点；其 `childProps` 子数组会被递归映射。

```ts
import { mapTree } from '@vben/utils';

const tree = [{ id: 1, children: [{ id: 2 }] }];
const mapped = mapTree(tree, (n) => ({ ...n, id: n.id * 10 }));
// [{ id: 10, children: [{ id: 20 }] }]
```

### 排序树

`sortTree`：递归对树排序，返回新结构（不修改原树）。

```ts
import { sortTree } from '@vben/utils';

const tree = [
  { id: 2, children: [] },
  { id: 1, children: [] },
];
const sorted = sortTree(tree, (a, b) => a.id - b.id); // 按 id 升序，返回新结构
```

## 数据处理

### 按字段去重

`uniqueByField`：根据指定字段对对象数组去重。

```ts
import { uniqueByField } from '@vben/utils';

uniqueByField([{ id: 1 }, { id: 1 }, { id: 2 }], 'id'); // [{ id: 1 }, { id: 2 }]
```

## 窗口操作

### 打开新窗口

`openWindow`：以指定参数打开新窗口。默认 `noopener = noreferrer = true`、`target = '_blank'`。

```ts
import { openWindow } from '@vben/utils';

openWindow('https://example.com');
openWindow('https://example.com', { target: '_self' });
```

### 新窗口打开路由

`openRouteInNewWindow`：在新窗口打开应用内路由 `path`，自动补全 origin 与 hash 前缀。

```ts
import { openRouteInNewWindow } from '@vben/utils';

openRouteInNewWindow('/dashboard');
```

## 防抖

`debounce`：来自 [`es-toolkit/compat`](https://github.com/toss/es-toolkit) 的防抖函数。

```ts
import { debounce } from '@vben/utils';

const fn = debounce(() => console.log('exec'), 200);
fn();
```

## 路径取值与设值

### 按路径取值

`get`：来自 [`es-toolkit/compat`](https://github.com/toss/es-toolkit)，按路径获取对象值。

```ts
import { get } from '@vben/utils';

get({ a: { b: 1 } }, 'a.b'); // 1
```

### 按路径设值

`set`：来自 [`es-toolkit/compat`](https://github.com/toss/es-toolkit)，按路径设置对象值。

```ts
import { set } from '@vben/utils';

const obj = {};
set(obj, 'a.b.c', 1); // obj -> { a: { b: { c: 1 } } }
```

## 深度比较与深拷贝

### 深度相等比较

`isEqual`：来自 [`es-toolkit/compat`](https://github.com/toss/es-toolkit) 的深度相等比较。

```ts
import { isEqual } from '@vben/utils';

isEqual({ a: 1 }, { a: 1 }); // true
```

### 深拷贝

`cloneDeep`：来自 [`lodash.clonedeep`](https://lodash.com/) 的深拷贝。

```ts
import { cloneDeep } from '@vben/utils';

const copy = cloneDeep({ a: { b: 1 } });
```

## 颜色工具

基于 `@ctrl/tinycolor` 与 `theme-colors`，提供颜色判断与格式转换。

### 判断深色

`isDarkColor`：判断颜色是否为深色。

```ts
import { isDarkColor } from '@vben/utils';

isDarkColor('#000'); // true
isDarkColor('#fff'); // false
```

### 判断浅色

`isLightColor`：判断颜色是否为浅色。

```ts
import { isLightColor } from '@vben/utils';

isLightColor('#fff'); // true
isLightColor('#000'); // false
```

### 转 HSL 字符串

`convertToHsl`：转为 `hsl(h s% l%)` 字符串；透明度 `< 1` 时追加 alpha。

```ts
import { convertToHsl } from '@vben/utils';

convertToHsl('#ff0000'); // 'hsl(0 100% 50%)'
```

### 转 HSL CSS 变量值

`convertToHslCssVar`：转为适合作为 CSS 变量值的 `h s% l%`（不带 `hsl()` 包裹）；透明度 `< 1` 时格式为 `h s% l% / a`。

```ts
import { convertToHslCssVar } from '@vben/utils';

convertToHslCssVar('#ff0000'); // '0 100% 50%'
```

### 转 RGB 字符串

`convertToRgb`：转为 RGB 字符串。会先剔除 `deg`/`grad`/`rad`/`turn` 单位（TinyColor 无法解析含这些单位的 hsl 字符串），无效颜色返回 `rgb(0, 0, 0)`。

```ts
import { convertToRgb } from '@vben/utils';

convertToRgb('hsl(0deg 100% 50%)'); // 'rgb(255, 0, 0)'
convertToRgb('xxx'); // 'rgb(0, 0, 0)'
```

### 校验颜色有效性

`isValidColor`：检查颜色字符串是否有效（基于 `TinyColor.isValid`），空值返回 `false`。

```ts
import { isValidColor } from '@vben/utils';

isValidColor('#fff'); // true
isValidColor('xxx'); // false
```

### TinyColor 颜色类

`TinyColor`：颜色处理类，来自第三方库 [@ctrl/tinycolor](https://github.com/bgrins/TinyColor)，可直接 `new TinyColor('#fff')` 使用。

```ts
import { TinyColor } from '@vben/utils';

new TinyColor('#ff0000').toHslString(); // 'hsl(0, 100%, 50%)'
```

`@vben/utils` 仅作再导出，实例上的全部方法（`lighten`、`darken`、`saturate`、`desaturate`、`brighten`、`toHexString`、`toHslString`、`toRgbString`、`isValid` 等）均来自 `@ctrl/tinycolor`，完整 API 见 [官方文档](https://github.com/bgrins/TinyColor)。

## UI 工具

### 获取弹出层容器

`getPopupContainer`：用于 `el-select` / `el-picker` 等组件的 `getPopupContainer` 属性。节点位于表单内返回所在 `form` 元素，否则返回节点父节点，未传入节点时返回 `document.body`。

```vue
<script setup lang="ts">
import { getPopupContainer } from '@vben/utils';
</script>

<template>
  <el-select :get-popup-container="getPopupContainer" />
</template>
```
