import type { Extensions, JSONContent } from '@tiptap/core';
import type { Editor } from '@tiptap/vue-3';

import type { Component } from 'vue';

export interface TipTapProps {
  editable?: boolean;
  extensions?: Extensions;
  minHeight?: number | string;
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
