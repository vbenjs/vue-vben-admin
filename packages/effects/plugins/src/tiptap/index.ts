import './style.css';

export { createDefaultTiptapExtensions } from './extensions';
export { default as VbenTiptapPreview } from './preview.vue';
export { default as VbenTiptap } from './tiptap.vue';

export type {
  TipTapPreviewProps,
  VbenTiptapChangeEvent,
  VbenTiptapExtensionOptions,
} from './types';
