---
outline: deep
---

# Vben Cropper 图片裁剪

`VCropper` 是一个纯原生实现的图片裁剪组件，支持自由比例和固定比例裁剪，可通过方法调用获取裁剪后的图片。

> 如果文档内没有参数说明，可以尝试在在线示例内寻找

::: info 写在前面

如果你觉得现有组件的封装不够理想，或者不完全符合你的需求，可以直接使用原生组件，亦或亲手封装一个适合的组件。框架提供的组件并非束缚，使用与否，完全取决于你的需求与自由。

:::

## 基础用法

最基本的图片裁剪，支持自由比例调整。

<DemoPreview dir="demos/vben-cropper/basic" />

## 固定比例裁剪

通过 `aspectRatio` 属性设置裁剪比例，格式为 `"宽:高"`，如 `"1:1"`、`"16:9"`、`"3:4"` 等。

<DemoPreview dir="demos/vben-cropper/aspect-ratio" />

## API

### Props

| 属性名        | 描述                                  | 类型     | 默认值 |
| ------------- | ------------------------------------- | -------- | ------ |
| `img`         | 图片地址（必填）                      | `string` | -      |
| `width`       | 容器宽度                              | `number` | `500`  |
| `height`      | 容器高度                              | `number` | `400`  |
| `aspectRatio` | 裁剪比例，格式如 `"1:1"`、`"16:9"` 等 | `string` | -      |

### Methods

通过 `ref` 调用组件方法：

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { VCropper } from '@vben/common-ui';

const cropperRef = ref<InstanceType<typeof VCropper>>();

const handleCrop = async () => {
  const result = await cropperRef.value?.getCropImage();
  // result 为 Blob 或 base64 字符串
};
</script>
```

#### getCropImage

裁剪并获取图片。

```ts
interface GetCropImageOptions {
  /** 输出图片格式 */
  format?: 'image/jpeg' | 'image/png';
  /** 压缩质量（0-1），仅对 jpeg 格式有效 */
  quality?: number;
  /** 输出类型 */
  outputType?: 'base64' | 'blob';
  /** 目标宽度（可选，不传则为原始裁剪宽度） */
  targetWidth?: number;
  /** 目标高度（可选，不传则为原始裁剪高度） */
  targetHeight?: number;
}

getCropImage(
  format?: 'image/jpeg' | 'image/png',
  quality?: number,
  outputType?: 'base64' | 'blob',
  targetWidth?: number,
  targetHeight?: number,
): Promise<Blob | string | undefined>
```

**参数说明：**

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `format` | `'image/jpeg' \| 'image/png'` | `'image/png'` | 输出图片格式 |
| `quality` | `number` | `0.92` | 压缩质量（0-1），仅 jpeg 有效 |
| `outputType` | `'base64' \| 'blob'` | `'blob'` | 输出类型，base64 字符串或 Blob 对象 |
| `targetWidth` | `number` | - | 目标宽度，不传则使用原始裁剪宽度 |
| `targetHeight` | `number` | - | 目标高度，不传则使用原始裁剪高度 |

## 功能特性

### 裁剪操作

- **拖拽移动** - 拖拽裁剪框中心区域移动裁剪位置
- **边角调整** - 拖拽四角调整裁剪框大小
- **边缘调整** - 拖拽四边中点调整单边

### 比例控制

- **自由比例** - 不设置 `aspectRatio` 时，可自由调整任意比例
- **固定比例** - 设置 `aspectRatio` 后，裁剪框始终保持设定比例

### 高清屏适配

组件自动适配 Retina 等高清屏幕，保证输出图片清晰无模糊。

### 图片适配

- 图片自动等比缩放以完整显示在容器内
- 支持本地图片和网络图片
- 网络图片需目标服务端支持 CORS 才能导出裁剪结果

## 使用示例

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { VCropper } from '@vben/common-ui';

const cropperRef = ref<InstanceType<typeof VCropper>>();
const imageUrl = ref('https://example.com/image.jpg');
const croppedImage = ref('');

// 获取裁剪后的 Blob 对象
const handleCropBlob = async () => {
  const blob = await cropperRef.value?.getCropImage('image/jpeg', 0.9, 'blob');
  if (blob instanceof Blob) {
    // 上传到服务器或创建预览URL
    const url = URL.createObjectURL(blob);
    croppedImage.value = url;
  }
};

// 获取裁剪后的 base64 字符串
const handleCropBase64 = async () => {
  const base64 = await cropperRef.value?.getCropImage('image/png', 1, 'base64');
  if (typeof base64 === 'string') {
    croppedImage.value = base64;
  }
};

// 导出指定尺寸
const handleCropWithSize = async () => {
  const blob = await cropperRef.value?.getCropImage(
    'image/jpeg',
    0.9,
    'blob',
    200, // 目标宽度
    200, // 目标高度
  );
};
</script>

<template>
  <div>
    <VCropper
      ref="cropperRef"
      :img="imageUrl"
      :width="500"
      :height="400"
      aspect-ratio="1:1"
    />
    <button @click="handleCropBlob">裁剪</button>
    <img v-if="croppedImage" :src="croppedImage" />
  </div>
</template>
```
