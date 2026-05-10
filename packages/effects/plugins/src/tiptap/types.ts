import type { Extensions, JSONContent } from '@tiptap/core';
import type { Editor } from '@tiptap/vue-3';

import type { Component } from 'vue';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageUpload: {
      uploadImage: () => ReturnType;
    };
  }
}

export interface ImageUploadOptions {
  /** 允许的文件类型，默认 'image/*' */
  accept?: string;
  /** 最大文件大小(字节)，默认 5MB */
  maxSize?: number;
  /** 上传失败回调，未提供时使用 alert 弹窗提示 */
  onUploadError?: (error: unknown) => void;
  /** 上传函数，返回图片 URL，可选 onProgress 回调报告上传进度 */
  upload: (
    file: File,
    onProgress?: (percent: number) => void,
  ) => Promise<string>;
}

export interface TipTapProps {
  editable?: boolean;
  extensions?: Extensions;
  imageUpload?: ImageUploadOptions;
  minHeight?: number | string;
  maxHeight?: number | string;
  placeholder?: string;
  previewable?: boolean;
  toolbar?: boolean;
}

export interface TipTapPreviewProps {
  class?: any;
  content?: string;
  minHeight?: number | string;
}

export interface VbenTiptapChangeEvent {
  html: string;
  json: JSONContent;
  text: string;
}

export interface VbenTiptapExtensionOptions {
  imageUpload?: ImageUploadOptions;
  /** 内部使用：追踪 blob URL 以便组件销毁时清理 */
  _blobUrlTracker?: Set<string>;
  placeholder?: string;
}

export interface ToolbarAction {
  action: (editor: Editor) => void;
  active?: {
    attrs?: Record<string, unknown>;
    name: string;
  };
  can?: (editor: Editor) => boolean;
  icon?: Component;
  indicatorColor?: (editor: Editor) => string | undefined;
  isActive?: (editor: Editor) => boolean;
  label: string;
  menu?: {
    items: ToolbarMenuItem[];
  };
  palette?: {
    apply: (editor: Editor, color: string) => void;
    clear?: (editor: Editor) => void;
    colors: string[];
    currentColor?: (editor: Editor) => string | undefined;
  };
  triggerText?: ((editor?: Editor) => string) | string;
}

export interface ToolbarMenuItem {
  action: (editor: Editor) => void;
  can?: (editor: Editor) => boolean;
  isActive?: (editor: Editor) => boolean;
  label: string;
  shortLabel: string;
}
