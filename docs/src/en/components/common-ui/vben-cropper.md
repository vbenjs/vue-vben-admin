---
outline: deep
---

# Vben Cropper Image Cropping

`VCropper` is a pure native image cropping component that supports both free and fixed aspect ratio cropping, with method-based access to cropped results.

> If some details are not obvious from the docs, check the live demos as well.

::: info Note

If you feel the current component implementation doesn't meet your needs, you can use native components directly or create your own component. The components provided by the framework are not constraints - use them at your discretion.

:::

## Basic Usage

Basic image cropping with free aspect ratio adjustment.

<DemoPreview dir="demos/vben-cropper/basic" />

## Fixed Aspect Ratio

Set the cropping ratio via the `aspectRatio` prop. The format is `"width:height"`, e.g. `"1:1"`, `"16:9"`, `"3:4"`.

<DemoPreview dir="demos/vben-cropper/aspect-ratio" />

## API

### Props

| Property      | Description                        | Type     | Default |
| ------------- | ---------------------------------- | -------- | ------- |
| `img`         | Image URL (required)               | `string` | -       |
| `width`       | Container width                    | `number` | `500`   |
| `height`      | Container height                   | `number` | `400`   |
| `aspectRatio` | Crop ratio, e.g. `"1:1"`, `"16:9"` | `string` | -       |

### Methods

Call component methods via `ref`:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { VCropper } from '@vben/common-ui';

const cropperRef = ref<InstanceType<typeof VCropper>>();

const handleCrop = async () => {
  const result = await cropperRef.value?.getCropImage();
  // result is a Blob or base64 string
};
</script>
```

#### getCropImage

Crop and retrieve the image.

```ts
getCropImage(
  format?: 'image/jpeg' | 'image/png',
  quality?: number,
  outputType?: 'base64' | 'blob',
  targetWidth?: number,
  targetHeight?: number,
): Promise<Blob | string | undefined>
```

**Parameters:**

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `format` | `'image/jpeg' \| 'image/png'` | `'image/png'` | Output image format |
| `quality` | `number` | `0.92` | Compression quality (0-1), only effective for jpeg |
| `outputType` | `'base64' \| 'blob'` | `'blob'` | Output type, base64 string or Blob object |
| `targetWidth` | `number` | - | Target width, defaults to original crop width if omitted |
| `targetHeight` | `number` | - | Target height, defaults to original crop height if omitted |

## Features

### Cropping Operations

- **Drag to Move** - Drag the center area of the crop box to move its position
- **Corner Resize** - Drag the four corners to resize the crop box
- **Edge Resize** - Drag the midpoints of edges to adjust a single side

### Aspect Ratio Control

- **Free Ratio** - Without `aspectRatio`, adjust the crop box to any ratio
- **Fixed Ratio** - With `aspectRatio` set, the crop box maintains the specified ratio

### HiDPI Support

The component automatically adapts to Retina and other high-DPI screens, ensuring crisp output images.

### Image Fitting

- Images are automatically scaled to fit within the container
- Supports both local and remote images
- Remote images require CORS support from the server to export cropped results

## Usage Example

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { VCropper } from '@vben/common-ui';

const cropperRef = ref<InstanceType<typeof VCropper>>();
const imageUrl = ref('https://example.com/image.jpg');
const croppedImage = ref('');

// Get cropped Blob
const handleCropBlob = async () => {
  const blob = await cropperRef.value?.getCropImage('image/jpeg', 0.9, 'blob');
  if (blob instanceof Blob) {
    // Upload to server or create preview URL
    const url = URL.createObjectURL(blob);
    croppedImage.value = url;
  }
};

// Get cropped base64 string
const handleCropBase64 = async () => {
  const base64 = await cropperRef.value?.getCropImage('image/png', 1, 'base64');
  if (typeof base64 === 'string') {
    croppedImage.value = base64;
  }
};

// Export with specific dimensions
const handleCropWithSize = async () => {
  const blob = await cropperRef.value?.getCropImage(
    'image/jpeg',
    0.9,
    'blob',
    200, // target width
    200, // target height
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
    <button @click="handleCropBlob">Crop</button>
    <img v-if="croppedImage" :src="croppedImage" />
  </div>
</template>
```
