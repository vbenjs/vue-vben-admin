import type { Extensions } from '@tiptap/vue-3';

import type { VbenTiptapExtensionOptions } from './types';

import { $t } from '@vben/locales';

import Document from '@tiptap/extension-document';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { Color, TextStyle } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';

export function createDefaultTiptapExtensions(
  options: VbenTiptapExtensionOptions = {},
): Extensions {
  return [
    Document,
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3, 4],
      },
    }),
    Underline,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    TextStyle,
    Color.configure({
      types: ['textStyle'],
    }),
    Highlight.configure({
      multicolor: true,
    }),
    Link.configure({
      autolink: true,
      defaultProtocol: 'https',
      enableClickSelection: true,
      openOnClick: false,
      protocols: ['mailto', { optionalSlashes: true, scheme: 'tel' }],
    }),
    Image.configure({
      allowBase64: true,
      HTMLAttributes: {
        class: 'vben-tiptap__image',
      },
    }),
    Placeholder.configure({
      placeholder: options.placeholder ?? $t('ui.tiptap.placeholder'),
    }),
  ];
}
