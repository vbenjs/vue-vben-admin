# Utils

::: tip Preface

`@vben/utils` is a shared utility package used across multiple apps. Through re-exports it inherits the full capabilities of `@vben-core/shared`'s `cache`, `color`, and `utils` sub-modules, and adds business utilities such as UI on top of them.

:::

::: tip

`@vben/utils` is already imported uniformly under each `app`; no separate installation is needed. The `@vben-core/shared/constants` sub-module is **not** re-exported — its exports (e.g. `ELEMENT_ID_LAYOUT_SCROLL`) must be imported directly from `@vben-core/shared/constants`.

:::

## Date

### Format date

`formatDate`: Formats a date using dayjs. `time` accepts `Date` / `Dayjs` / `number` / `string`; an empty value returns `''`; on parse failure it falls back to `String(time)`. The result is rendered in the current timezone.

```ts
import { formatDate } from '@vben/utils';

formatDate('2024-01-01'); // '2024-01-01'
formatDate(new Date(), 'YYYY/MM/DD'); // '2024/01/01'
formatDate(undefined); // ''
```

### Format date time

`formatDateTime`: Equivalent to `formatDate(time, 'YYYY-MM-DD HH:mm:ss')`.

```ts
import { formatDateTime } from '@vben/utils';

formatDateTime(new Date('2024-01-01T12:34:56')); // '2024-01-01 12:34:56'
```

### Check Date instance

`isDate`: Type guard for `Date` instances.

```ts
import { isDate } from '@vben/utils';

isDate(new Date()); // true
isDate('2024-01-01'); // false
```

### Check dayjs instance

`isDayjsObject`: Type guard for dayjs instances.

```ts
import { isDayjsObject } from '@vben/utils';
import dayjs from 'dayjs';

isDayjsObject(dayjs()); // true
isDayjsObject(new Date()); // false
```

## Array comparison

### Array equality

`arraysEqual`: Compares two arrays for equality (order-insensitive, by element count).

```ts
import { arraysEqual } from '@vben/utils';

arraysEqual([1, 2], [2, 1]); // true
arraysEqual([1, 2], [1, 2, 3]); // false
```

### Array strict equality

`arraysStrictEqual`: Compares two arrays for strict equality (order-sensitive).

```ts
import { arraysStrictEqual } from '@vben/utils';

arraysStrictEqual([1, 2], [2, 1]); // false
arraysStrictEqual([1, 2], [1, 2]); // true
```

## Object diff

### Object diff

`diff`: Deep-compares two objects and returns the diff (only changed fields); arrays are compared order-insensitively.

```ts
import { diff } from '@vben/utils';

diff({ a: 1, b: 2 }, { a: 1, b: 3 }); // { b: 3 }
diff({ list: [1, 2] }, { list: [2, 1] }); // {} (order-insensitive, no diff)
```

### Object strict diff

`diffStrict`: Deep-compares two objects; arrays are compared order-sensitively.

```ts
import { diffStrict } from '@vben/utils';

diffStrict({ a: [1, 2] }, { a: [2, 1] }); // { a: [2, 1] }
```

## File download

### Download from URL

`downloadFileFromUrl`: Downloads from a URL, with cross-origin support. Uses `<a download>` on Chrome/Safari; falls back to `openWindow` elsewhere. Throws when `source` is falsy or non-string; URL syntax is not validated.

```ts
import { downloadFileFromUrl } from '@vben/utils';

await downloadFileFromUrl({ source: 'https://example.com/file.pdf' });
await downloadFileFromUrl({
  source: 'https://example.com/report.pdf',
  fileName: 'report.pdf',
});
```

### Download from Base64

`downloadFileFromBase64`: Triggers a download from Base64 data.

```ts
import { downloadFileFromBase64 } from '@vben/utils';

downloadFileFromBase64({
  source: 'data:text/plain;base64,aGVsbG8=',
  fileName: 'hello.txt',
});
```

### Download from image URL

`downloadFileFromImageUrl`: Converts the image URL to Base64 via `urlToBase64`, then downloads it.

```ts
import { downloadFileFromImageUrl } from '@vben/utils';

await downloadFileFromImageUrl({
  source: 'https://example.com/logo.png',
  fileName: 'logo.png',
});
```

### Download from Blob

`downloadFileFromBlob`: Triggers a download from a `Blob` (creates an object URL). Throws `TypeError` if the input is not a `Blob`.

```ts
import { downloadFileFromBlob } from '@vben/utils';

downloadFileFromBlob({
  source: new Blob(['hello'], { type: 'text/plain' }),
  fileName: 'hello.txt',
});
```

### Download from BlobPart

`downloadFileFromBlobPart`: Downloads BlobPart data; non-`Blob` values are wrapped as `application/octet-stream` Blobs first.

```ts
import { downloadFileFromBlobPart } from '@vben/utils';

downloadFileFromBlobPart({ source: ['hello', 'world'], fileName: 'data.txt' });
```

### Image URL to Base64

`urlToBase64`: Converts an image URL to a Base64 dataURL via a canvas (defaults to `image/png`).

```ts
import { urlToBase64 } from '@vben/utils';

const dataURL = await urlToBase64('https://example.com/logo.png');
// 'data:image/png;base64,iVBORw0KGgo...'
```

### Trigger download

`triggerDownload`: Appends a hidden `<a>`, clicks, removes it, then calls `URL.revokeObjectURL` after `revokeDelay` ms to release memory.

```ts
import { triggerDownload } from '@vben/utils';

triggerDownload('https://example.com/file.pdf', 'file.pdf');
```

## Type checking

### Check undefined

`isUndefined`: Whether the value is `undefined`.

```ts
import { isUndefined } from '@vben/utils';

isUndefined(undefined); // true
isUndefined(null); // false
```

### Check boolean

`isBoolean`: Whether the value is a boolean.

```ts
import { isBoolean } from '@vben/utils';

isBoolean(true); // true
isBoolean(0); // false
```

### Check empty

`isEmpty`: Whether the value is empty: `null` / `undefined` / empty string / zero-length array / empty Map or Set / object with no keys.

```ts
import { isEmpty } from '@vben/utils';

isEmpty(''); // true
isEmpty([]); // true
isEmpty({}); // true
isEmpty(null); // true
isEmpty('a'); // false
```

### Check HTTP URL

`isHttpUrl`: Whether the string starts with `http://` or `https://`.

```ts
import { isHttpUrl } from '@vben/utils';

isHttpUrl('https://a.com'); // true
isHttpUrl('/api/user'); // false
```

### Check window object

`isWindow`: Whether the value is the `window` object.

```ts
import { isWindow } from '@vben/utils';

isWindow(window); // true
isWindow(document); // false
```

### Check macOS

`isMacOs`: Whether the current env is macOS (by userAgent).

```ts
import { isMacOs } from '@vben/utils';

isMacOs(); // true on macOS
```

### Check Windows

`isWindowsOs`: Whether the current env is Windows.

```ts
import { isWindowsOs } from '@vben/utils';

isWindowsOs(); // true on Windows
```

### Check number

`isNumber`: Whether the value is a finite number.

```ts
import { isNumber } from '@vben/utils';

isNumber(1); // true
isNumber(Infinity); // false
isNumber('1'); // false
```

### Check function

`isFunction`: Type guard re-exported from `@vue/shared`.

```ts
import { isFunction } from '@vben/utils';

isFunction(() => {}); // true
isFunction('fn'); // false
```

### Check object

`isObject`: Type guard re-exported from `@vue/shared`.

```ts
import { isObject } from '@vben/utils';

isObject({}); // true
isObject([1]); // true
isObject(null); // false
```

### Check string

`isString`: Type guard re-exported from `@vue/shared`.

```ts
import { isString } from '@vben/utils';

isString('a'); // true
isString(1); // false
```

### Get first non-null value

`getFirstNonNullOrUndefined`: Returns the first value in the list that is not `null` or `undefined`; returns `undefined` if all are.

```ts
import { getFirstNonNullOrUndefined } from '@vben/utils';

getFirstNonNullOrUndefined(undefined, null, 42, 'hello'); // 42
getFirstNonNullOrUndefined(undefined, null); // undefined
```

## String conversion

### Capitalize first letter

`capitalizeFirstLetter`: Capitalizes the first letter.

```ts
import { capitalizeFirstLetter } from '@vben/utils';

capitalizeFirstLetter('abc'); // 'Abc'
```

### Lowercase first letter

`toLowerCaseFirstLetter`: Lowercases the first letter.

```ts
import { toLowerCaseFirstLetter } from '@vben/utils';

toLowerCaseFirstLetter('Abc'); // 'abc'
```

### To camelCase key

`toCamelCase`: Builds a camelCase key (returns `key` when there is no parent, otherwise concatenates parent + capitalized sub-key).

```ts
import { toCamelCase } from '@vben/utils';

toCamelCase('name'); // 'name'
toCamelCase('name', 'user'); // 'userName'
```

### Kebab to camelCase

`kebabToCamelCase`: Converts kebab-case to camelCase.

```ts
import { kebabToCamelCase } from '@vben/utils';

kebabToCamelCase('my-var-name'); // 'myVarName'
```

## Resource loading

### Load script

`loadScript`: Dynamically loads a JS file. Resolves immediately if a `<script>` with the same `src` already exists; rejects on load error.

```ts
import { loadScript } from '@vben/utils';

await loadScript('https://cdn.example.com/lib.js');
```

## Async & flow control

### Stack

`Stack`: Stack data structure. When `dedup` is `true`, pushing removes the old position first; `maxSize` caps the size, dropping the oldest element when exceeded.

```ts
import { Stack } from '@vben/utils';

const stack = new Stack<string>(true, 3);
stack.push('a', 'b', 'c');
stack.push('a'); // dedup -> ['b', 'c', 'a']
stack.peek(); // 'a'
stack.pop(); // 'a'
stack.size; // 2
stack.toArray(); // ['b', 'c']
```

### Create stack

`createStack`: Factory function, equivalent to `new Stack(...)`.

```ts
import { createStack } from '@vben/utils';

const stack = createStack<string>(false, 5);
stack.push('a', 'b');
stack.toArray(); // ['a', 'b']
```

## Promise to err/data tuple

`to`: Converts a Promise into a Go-style `[err, data]` tuple. When `errorExt` is provided on failure, it is merged into the error object.

```ts
import { to } from '@vben/utils';

const [err, data] = await to(fetchUser(id));
if (err) return;
console.log(data);
```

## Tree traversal

### Traverse tree values

`traverseTreeValues`: Deeply traverses a tree, collecting each node mapped through `getValue`, and filters out falsy values.

```ts
import { traverseTreeValues } from '@vben/utils';

const tree = [{ id: 1, children: [{ id: 2 }] }];
traverseTreeValues(tree, (n) => n.id); // [1, 2]
```

### Filter tree

`filterTree`: Filters tree nodes by a predicate, keeping matching nodes (including matching children) in original order. **Mutates the input tree.**

```ts
import { filterTree } from '@vben/utils';

const tree = [{ id: 1, children: [{ id: 2 }] }];
filterTree(tree, (n) => n.id === 1); // keeps the id=1 node
```

### Map tree

`mapTree`: Recursively maps tree nodes. `mapper` receives the current node and its parent and returns a new node; its `childProps` children are recursively mapped.

```ts
import { mapTree } from '@vben/utils';

const tree = [{ id: 1, children: [{ id: 2 }] }];
const mapped = mapTree(tree, (n) => ({ ...n, id: n.id * 10 }));
// [{ id: 10, children: [{ id: 20 }] }]
```

### Sort tree

`sortTree`: Recursively sorts a tree, returning a new structure (does not mutate the input).

```ts
import { sortTree } from '@vben/utils';

const tree = [
  { id: 2, children: [] },
  { id: 1, children: [] },
];
const sorted = sortTree(tree, (a, b) => a.id - b.id); // ascending by id, returns a new structure
```

## Data processing

### Deduplicate by field

`uniqueByField`: Deduplicates an array of objects by the given field.

```ts
import { uniqueByField } from '@vben/utils';

uniqueByField([{ id: 1 }, { id: 1 }, { id: 2 }], 'id'); // [{ id: 1 }, { id: 2 }]
```

## Window operations

### Open new window

`openWindow`: Opens a new window with the given options. Defaults: `noopener = noreferrer = true`, `target = '_blank'`.

```ts
import { openWindow } from '@vben/utils';

openWindow('https://example.com');
openWindow('https://example.com', { target: '_self' });
```

### Open route in new window

`openRouteInNewWindow`: Opens an in-app route `path` in a new window, automatically filling in the origin and hash prefix.

```ts
import { openRouteInNewWindow } from '@vben/utils';

openRouteInNewWindow('/dashboard');
```

## Debounce

`debounce`: Debounce function from [`es-toolkit/compat`](https://github.com/toss/es-toolkit).

```ts
import { debounce } from '@vben/utils';

const fn = debounce(() => console.log('exec'), 200);
fn();
```

## Path get & set

### Get value by path

`get`: From [`es-toolkit/compat`](https://github.com/toss/es-toolkit), gets a value by path.

```ts
import { get } from '@vben/utils';

get({ a: { b: 1 } }, 'a.b'); // 1
```

### Set value by path

`set`: From [`es-toolkit/compat`](https://github.com/toss/es-toolkit), sets a value by path.

```ts
import { set } from '@vben/utils';

const obj = {};
set(obj, 'a.b.c', 1); // obj -> { a: { b: { c: 1 } } }
```

## Deep compare & clone

### Deep equality

`isEqual`: Deep equality check from [`es-toolkit/compat`](https://github.com/toss/es-toolkit).

```ts
import { isEqual } from '@vben/utils';

isEqual({ a: 1 }, { a: 1 }); // true
```

### Deep clone

`cloneDeep`: Deep clone from [`lodash.clonedeep`](https://lodash.com/).

```ts
import { cloneDeep } from '@vben/utils';

const copy = cloneDeep({ a: { b: 1 } });
```

## Color Utilities

Built on `@ctrl/tinycolor` and `theme-colors`; provides color predicates and format conversion.

### Check dark color

`isDarkColor`: Whether a color is dark.

```ts
import { isDarkColor } from '@vben/utils';

isDarkColor('#000'); // true
isDarkColor('#fff'); // false
```

### Check light color

`isLightColor`: Whether a color is light.

```ts
import { isLightColor } from '@vben/utils';

isLightColor('#fff'); // true
isLightColor('#000'); // false
```

### Convert to HSL string

`convertToHsl`: Converts to an `hsl(h s% l%)` string; appends alpha when it is `< 1`.

```ts
import { convertToHsl } from '@vben/utils';

convertToHsl('#ff0000'); // 'hsl(0 100% 50%)'
```

### Convert to HSL CSS variable

`convertToHslCssVar`: Converts to a value suitable for CSS variables: `h s% l%` (without the `hsl()` wrapper); format is `h s% l% / a` when alpha is `< 1`.

```ts
import { convertToHslCssVar } from '@vben/utils';

convertToHslCssVar('#ff0000'); // '0 100% 50%'
```

### Convert to RGB string

`convertToRgb`: Converts to an RGB string. Strips `deg`/`grad`/`rad`/`turn` units first (TinyColor cannot parse hsl strings containing these units); returns `rgb(0, 0, 0)` for invalid colors.

```ts
import { convertToRgb } from '@vben/utils';

convertToRgb('hsl(0deg 100% 50%)'); // 'rgb(255, 0, 0)'
convertToRgb('xxx'); // 'rgb(0, 0, 0)'
```

### Validate color

`isValidColor`: Whether the color string is valid (based on `TinyColor.isValid`); returns `false` for empty values.

```ts
import { isValidColor } from '@vben/utils';

isValidColor('#fff'); // true
isValidColor('xxx'); // false
```

### TinyColor class

`TinyColor`: Color processing class from the third-party library [@ctrl/tinycolor](https://github.com/bgrins/TinyColor); use directly as `new TinyColor('#fff')`.

```ts
import { TinyColor } from '@vben/utils';

new TinyColor('#ff0000').toHslString(); // 'hsl(0, 100%, 50%)'
```

`@vben/utils` only re-exports it; all instance methods (`lighten`, `darken`, `saturate`, `desaturate`, `brighten`, `toHexString`, `toHslString`, `toRgbString`, `isValid`, etc.) come from `@ctrl/tinycolor` — see the [official docs](https://github.com/bgrins/TinyColor) for the full API.

## UI Utilities

### Get popup container

`getPopupContainer`: Used for the `getPopupContainer` prop of components like `el-select` / `el-picker`. Returns the enclosing `form` element if the node is inside a form, otherwise the node's parent, or `document.body` when no node is provided.

```vue
<script setup lang="ts">
import { getPopupContainer } from '@vben/utils';
</script>

<template>
  <el-select :get-popup-container="getPopupContainer" />
</template>
```
