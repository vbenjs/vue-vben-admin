---
outline: deep
---

# Vben Tiptap Rich Text Editor

A rich text editor component built on [Tiptap](https://tiptap.dev/), supporting rich text formatting, image insertion, and image upload features.

> If some details are not obvious from the docs, check the live demos as well.

::: info Note

If you feel the current component implementation doesn't meet your needs, you can use native components directly or create your own component. The components provided by the framework are not constraints - use them at your discretion.

:::

## Basic Usage

<DemoPreview dir="demos/vben-tiptap/basic" />

## Component List

### VbenTiptap

Main rich text editor component.

### VbenTiptapPreview

Read-only preview component for displaying editor content.

## API

### Props

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| `modelValue` (v-model) | Editor content (HTML string) | `string` | `''` |
| `editable` | Whether the editor is editable | `boolean` | `true` |
| `toolbar` | Whether to show the toolbar | `boolean` | `true` |
| `previewable` | Whether to show the preview button | `boolean` | `true` |
| `placeholder` | Placeholder text | `string` | - |
| `minHeight` | Minimum height | `number \| string` | `240` |
| `maxHeight` | Maximum height | `number \| string` | `400` |
| `extensions` | Custom Tiptap extensions | `Extensions` | - |
| `imageUpload` | Image upload configuration | `ImageUploadOptions` | - |

### Events

| Event    | Description                    | Parameters              |
| -------- | ------------------------------ | ----------------------- |
| `change` | Triggered when content changes | `VbenTiptapChangeEvent` |

#### VbenTiptapChangeEvent

```ts
interface VbenTiptapChangeEvent {
  html: string; // HTML content
  json: JSONContent; // JSON structure
  text: string; // Plain text content
}
```

### ImageUploadOptions

Image upload configuration:

```ts
interface ImageUploadOptions {
  /** Allowed file types, default 'image/*' */
  accept?: string;
  /** Max file size in bytes, default 5MB */
  maxSize?: number;
  /** Upload error callback, uses alert if not provided */
  onUploadError?: (error: unknown) => void;
  /** Upload function, returns image URL */
  upload: (
    file: File,
    onProgress?: (percent: number) => void,
  ) => Promise<string>;
}
```

### VbenTiptapPreview Props

| Property    | Description             | Type               | Default |
| ----------- | ----------------------- | ------------------ | ------- |
| `content`   | HTML content to preview | `string`           | `''`    |
| `minHeight` | Minimum height          | `number \| string` | `160`   |
| `class`     | Custom class name       | `any`              | -       |

## Toolbar Features

The editor toolbar provides the following features:

### Formatting

- **Undo/Redo** - Undo or redo editing operations
- **Clear Formatting** - Remove all formatting from selected text
- **Bold** - Bold text
- **Italic** - Italic text
- **Underline** - Underline text
- **Strikethrough** - Strikethrough text
- **Inline Code** - Inline code mark

### Structure

- **Headings** - Paragraph, H1-H4 heading switching
- **Ordered List** - Numbered list
- **Bullet List** - Bulleted list
- **Blockquote** - Quote block style
- **Code Block** - Multi-line code block

### Links & Images

- **Insert Link** - Insert or edit hyperlinks
- **Remove Link** - Remove link from selected text
- **Insert Image** - Insert image via URL

### Style

- **Text Color** - Set text color (preset palette)
- **Highlight Color** - Set text background highlight color

### Alignment

- **Align Left** - Left align text
- **Align Center** - Center align text
- **Align Right** - Right align text

### Other

- **Preview** - Preview content in a modal

## Image Upload

<DemoPreview dir="demos/vben-tiptap/image-upload" />

When `imageUpload` is configured, the toolbar image button becomes a dropdown menu with "Upload" and "URL" options.

### Upload Methods

Three image upload methods are supported:

1. **File Selection** - Click the upload button in toolbar
2. **Drag & Drop** - Drag images directly into the editor
3. **Paste** - Paste images into the editor

### Upload Progress Display

During upload:

- **Loading Indicator** - Spinner animation indicating upload in progress
- **Progress Bar** - Shows progress bar when upload function provides `onProgress` callback

### File Validation

- `accept` - Specify allowed file types (MIME types)
- `maxSize` - Maximum file size limit (bytes)
- Validation failure triggers `onUploadError` callback or default alert

::: warning Important Notes

- Only single image upload is supported; multi-image drag/paste will show a prompt and process only the first image
- Do not save editor content (`getHTML()`) during upload as image URLs are temporary blob URLs
- When using custom `extensions`, the image upload feature will not be available (toolbar won't show upload option)

:::

## Custom Extensions

Pass custom Tiptap extension configurations via the `extensions` property:

```vue
<script setup lang="ts">
import { VbenTiptap } from '@vben/plugins/tiptap';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';

const extensions = [
  StarterKit,
  Underline,
  // Other extensions...
];
</script>

<template>
  <VbenTiptap v-model="content" :extensions="extensions" />
</template>
```

::: warning Custom Extensions Note

When using custom `extensions`:

- Default extension configuration will not take effect
- Image upload feature is not available (toolbar won't show upload option)
- You need to configure all required editor features yourself

:::
