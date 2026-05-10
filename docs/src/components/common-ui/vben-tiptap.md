---
outline: deep
---

# Vben Tiptap 富文本编辑器

基于 [Tiptap](https://tiptap.dev/) 构建的富文本编辑器组件，支持丰富的文本格式化、图片插入、图片上传等功能。

> 如果文档内没有参数说明，可以尝试在在线示例内寻找

::: info 写在前面

如果你觉得现有组件的封装不够理想，或者不完全符合你的需求，可以直接使用原生组件，亦或亲手封装一个适合的组件。框架提供的组件并非束缚，使用与否，完全取决于你的需求与自由。

:::

## 基础用法

<DemoPreview dir="demos/vben-tiptap/basic" />

## 组件列表

### VbenTiptap

富文本编辑器主组件。

### VbenTiptapPreview

富文本内容预览组件，用于只读展示编辑器内容。

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `modelValue` (v-model) | 编辑器内容（HTML字符串） | `string` | `''` |
| `editable` | 是否可编辑 | `boolean` | `true` |
| `toolbar` | 是否显示工具栏 | `boolean` | `true` |
| `previewable` | 是否显示预览按钮 | `boolean` | `true` |
| `placeholder` | 占位提示文本 | `string` | - |
| `minHeight` | 最小高度 | `number \| string` | `240` |
| `maxHeight` | 最大高度 | `number \| string` | `400` |
| `extensions` | 自定义 Tiptap 扩展配置 | `Extensions` | - |
| `imageUpload` | 图片上传配置 | `ImageUploadOptions` | - |

### Events

| 事件名   | 说明           | 参数类型                |
| -------- | -------------- | ----------------------- |
| `change` | 内容变化时触发 | `VbenTiptapChangeEvent` |

#### VbenTiptapChangeEvent

```ts
interface VbenTiptapChangeEvent {
  html: string; // HTML 内容
  json: JSONContent; // JSON 结构内容
  text: string; // 纯文本内容
}
```

### ImageUploadOptions

图片上传配置项：

```ts
interface ImageUploadOptions {
  /** 允许的文件类型，默认 'image/*' */
  accept?: string;
  /** 最大文件大小(字节)，默认 5MB */
  maxSize?: number;
  /** 上传失败回调，未提供时使用 alert 弹窗提示 */
  onUploadError?: (error: unknown) => void;
  /** 上传函数，返回图片 URL */
  upload: (
    file: File,
    onProgress?: (percent: number) => void,
  ) => Promise<string>;
}
```

### VbenTiptapPreview Props

| 属性名      | 说明               | 类型               | 默认值 |
| ----------- | ------------------ | ------------------ | ------ |
| `content`   | 要预览的 HTML 内容 | `string`           | `''`   |
| `minHeight` | 最小高度           | `number \| string` | `160`  |
| `class`     | 自定义类名         | `any`              | -      |

## 工具栏功能

编辑器工具栏提供以下功能：

### 格式化

- **撤销/重做** - 撤销或重做编辑操作
- **清除格式** - 清除选中文本的所有格式
- **粗体** - 加粗文本
- **斜体** - 斜体文本
- **下划线** - 下划线文本
- **删除线** - 删除线文本
- **行内代码** - 行内代码标记

### 结构

- **标题** - 段落、H1-H4 标题切换
- **有序列表** - 有序编号列表
- **无序列表** - 无序符号列表
- **引用块** - 引用块样式
- **代码块** - 多行代码块

### 链接与图片

- **插入链接** - 插入或编辑超链接
- **移除链接** - 移除选中文本的链接
- **插入图片** - 通过 URL 插入图片

### 样式

- **文字颜色** - 设置文字颜色（预设色板）
- **背景颜色** - 设置文字背景高亮颜色

### 对齐

- **左对齐** - 文本左对齐
- **居中对齐** - 文本居中对齐
- **右对齐** - 文本右对齐

### 其他

- **预览** - 在弹窗中预览编辑内容

## 图片上传

<DemoPreview dir="demos/vben-tiptap/image-upload" />

当配置 `imageUpload` 时，工具栏的图片按钮会变为下拉菜单，包含「本地上传」和「URL 插入」两个选项。

### 上传方式

支持三种图片上传方式：

1. **文件选择** - 点击工具栏本地上传按钮
2. **拖拽上传** - 直接拖拽图片到编辑器区域
3. **粘贴上传** - 粘贴图片到编辑器

### 上传进度显示

上传过程中会显示：

- **加载指示器** - 旋转动画指示上传进行中
- **进度条** - 当上传函数提供 `onProgress` 回调时，显示进度条

### 文件校验

- `accept` - 指定允许的文件类型（MIME类型）
- `maxSize` - 最大文件大小限制（字节）
- 校验失败时会触发 `onUploadError` 回调或默认 alert 提示

::: warning 注意事项

- 仅支持单张图片上传，多图拖拽/粘贴时会提示并仅处理第一张
- 上传中不要保存编辑器内容（`getHTML()`），因为此时图片 URL 为临时 blob URL
- 自定义 `extensions` 时，图片上传功能将不显示（因为可能缺少 uploadImage 命令）

:::

## 自定义扩展

通过 `extensions` 属性可以传入自定义的 Tiptap 扩展配置：

```vue
<script setup lang="ts">
import { VbenTiptap } from '@vben/plugins/tiptap';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';

const extensions = [
  StarterKit,
  Underline,
  // 其他扩展...
];
</script>

<template>
  <VbenTiptap v-model="content" :extensions="extensions" />
</template>
```

::: warning 自定义扩展注意事项

使用自定义 `extensions` 时：

- 默认扩展配置将不会生效
- 图片上传功能不可用（工具栏不显示上传选项）
- 需自行配置所需的编辑器功能

:::
