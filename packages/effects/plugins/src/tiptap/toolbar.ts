import type { Editor } from '@tiptap/vue-3';

import type {
  ImageUploadOptions,
  ToolbarAction,
  ToolbarMenuItem,
} from './types';

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Highlighter,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  MessageSquareCode,
  Paintbrush,
  Redo2,
  RemoveFormatting,
  SquareCode,
  Strikethrough,
  TextQuote,
  Underline,
  Undo2,
  Unlink2,
} from '@vben/icons';
import { $t } from '@vben/locales';
import { COLOR_PRESETS } from '@vben/preferences';

import { prompt } from '@vben-core/popup-ui';

const headingLevels = [1, 2, 3, 4] as const;
const editorColorPresets = [
  'hsl(var(--foreground))',
  'hsl(var(--warning))',
  'hsl(var(--success))',
  'hsl(var(--destructive))',
  ...COLOR_PRESETS.map((item) => item.color),
];
const editorHighlightPresets = [
  withAlpha('hsl(var(--warning))', 0.45),
  withAlpha('hsl(var(--success))', 0.35),
  withAlpha('hsl(var(--primary))', 0.3),
  withAlpha('hsl(var(--destructive))', 0.3),
  ...COLOR_PRESETS.map((item) => withAlpha(item.color, 0.4)),
];

function createHeadingMenuItems(): ToolbarMenuItem[] {
  return [
    {
      action: (editor) => editor.chain().focus().setParagraph().run(),
      can: (editor) => editor.can().chain().focus().setParagraph().run(),
      isActive: (editor) => editor.isActive('paragraph'),
      label: $t('ui.tiptap.toolbar.paragraph'),
      shortLabel: 'P',
    },
    ...headingLevels.map((level) => ({
      action: (editor: Editor) =>
        editor.chain().focus().toggleHeading({ level }).run(),
      can: (editor: Editor) =>
        editor.can().chain().focus().toggleHeading({ level }).run(),
      isActive: (editor: Editor) => editor.isActive('heading', { level }),
      label: $t(`ui.tiptap.toolbar.heading${level}`),
      shortLabel: `H${level}`,
    })),
  ];
}

function getHeadingTriggerText(editor?: Editor) {
  if (editor?.isActive('paragraph')) {
    return 'P';
  }

  const level = headingLevels.find((headingLevel) =>
    editor?.isActive('heading', { level: headingLevel }),
  );

  return level ? `H${level}` : 'H';
}

function normalizeLinkUrl(url: string) {
  if (/^(https?:|mailto:|tel:)/i.test(url)) {
    return url;
  }

  return `https://${url}`;
}

function withAlpha(color: string, alpha: number) {
  const normalizedAlpha = Math.min(Math.max(alpha, 0), 1);
  const hslMatch = color.match(/^hsl\((.+)\)$/);

  if (!hslMatch) {
    return color;
  }

  return `hsl(${hslMatch[1]} / ${normalizedAlpha})`;
}

async function handleLinkAction(editor: Editor) {
  const currentHref = editor.getAttributes('link').href as string | undefined;

  let url: string | undefined;

  try {
    url = await prompt<string>({
      componentProps: {
        placeholder: 'https://example.com',
      },
      content: $t('ui.tiptap.prompts.link'),
      defaultValue: currentHref ?? '',
    });
  } catch {
    return;
  }

  const nextUrl = (url ?? '').trim();

  if (!nextUrl) {
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    return;
  }

  editor
    .chain()
    .focus()
    .extendMarkRange('link')
    .setLink({
      href: normalizeLinkUrl(nextUrl),
    })
    .run();
}

async function handleImageAction(editor: Editor) {
  let url: string | undefined;

  try {
    url = await prompt<string>({
      componentProps: {
        placeholder: 'https://example.com/image.png',
      },
      content: $t('ui.tiptap.prompts.image'),
      defaultValue: '',
    });
  } catch {
    return;
  }

  const nextUrl = (url ?? '').trim();

  if (!nextUrl) {
    return;
  }

  editor.chain().focus().setImage({ src: nextUrl }).run();
}

export function createToolbarGroups(
  imageUpload?: ImageUploadOptions,
): ToolbarAction[][] {
  const headingMenuItems = createHeadingMenuItems();

  return [
    [
      {
        action: (editor) => editor.chain().focus().undo().run(),
        can: (editor) => editor.can().chain().focus().undo().run(),
        icon: Undo2,
        label: $t('ui.tiptap.toolbar.undo'),
      },
      {
        action: (editor) => editor.chain().focus().redo().run(),
        can: (editor) => editor.can().chain().focus().redo().run(),
        icon: Redo2,
        label: $t('ui.tiptap.toolbar.redo'),
      },
      {
        action: (editor) =>
          editor.chain().focus().clearNodes().unsetAllMarks().run(),
        icon: RemoveFormatting,
        label: $t('ui.tiptap.toolbar.clear'),
      },
    ],
    [
      {
        action: (editor) => editor.chain().focus().toggleBold().run(),
        active: { name: 'bold' },
        can: (editor) => editor.can().chain().focus().toggleBold().run(),
        icon: Bold,
        label: $t('ui.tiptap.toolbar.bold'),
      },
      {
        action: (editor) => editor.chain().focus().toggleItalic().run(),
        active: { name: 'italic' },
        can: (editor) => editor.can().chain().focus().toggleItalic().run(),
        icon: Italic,
        label: $t('ui.tiptap.toolbar.italic'),
      },
      {
        action: (editor) => editor.chain().focus().toggleUnderline().run(),
        active: { name: 'underline' },
        can: (editor) => editor.can().chain().focus().toggleUnderline().run(),
        icon: Underline,
        label: $t('ui.tiptap.toolbar.underline'),
      },
      {
        action: (editor) => editor.chain().focus().toggleStrike().run(),
        active: { name: 'strike' },
        can: (editor) => editor.can().chain().focus().toggleStrike().run(),
        icon: Strikethrough,
        label: $t('ui.tiptap.toolbar.strike'),
      },
      {
        action: (editor) => editor.chain().focus().toggleCode().run(),
        active: { name: 'code' },
        can: (editor) => editor.can().chain().focus().toggleCode().run(),
        icon: SquareCode,
        label: $t('ui.tiptap.toolbar.code'),
      },
    ],
    [
      {
        action: () => {},
        can: (editor) =>
          headingMenuItems.some((item) => (item.can ? item.can(editor) : true)),
        isActive: (editor) =>
          headingMenuItems.some((item) => item.isActive?.(editor)),
        label: $t('ui.tiptap.toolbar.heading'),
        menu: {
          items: headingMenuItems,
        },
        triggerText: (editor) => getHeadingTriggerText(editor),
      },
      {
        action: (editor) => editor.chain().focus().toggleBulletList().run(),
        active: { name: 'bulletList' },
        can: (editor) => editor.can().chain().focus().toggleBulletList().run(),
        icon: List,
        label: $t('ui.tiptap.toolbar.bulletList'),
      },
      {
        action: (editor) => editor.chain().focus().toggleOrderedList().run(),
        active: { name: 'orderedList' },
        can: (editor) => editor.can().chain().focus().toggleOrderedList().run(),
        icon: ListOrdered,
        label: $t('ui.tiptap.toolbar.orderedList'),
      },
      {
        action: (editor) => editor.chain().focus().toggleBlockquote().run(),
        active: { name: 'blockquote' },
        can: (editor) => editor.can().chain().focus().toggleBlockquote().run(),
        icon: TextQuote,
        label: $t('ui.tiptap.toolbar.blockquote'),
      },
      {
        action: (editor) => editor.chain().focus().toggleCodeBlock().run(),
        active: { name: 'codeBlock' },
        can: (editor) => editor.can().chain().focus().toggleCodeBlock().run(),
        icon: MessageSquareCode,
        label: $t('ui.tiptap.toolbar.codeBlock'),
      },
    ],
    [
      {
        action: (editor) => handleLinkAction(editor),
        active: { name: 'link' },
        can: (editor) =>
          editor.can().chain().focus().extendMarkRange('link').run(),
        icon: Link2,
        label: $t('ui.tiptap.toolbar.link'),
      },
      {
        action: (editor) => editor.chain().focus().unsetLink().run(),
        can: (editor) => editor.can().chain().focus().unsetLink().run(),
        icon: Unlink2,
        isActive: (editor) => editor.isActive('link'),
        label: $t('ui.tiptap.toolbar.unlink'),
      },
      {
        action: (editor) => handleImageAction(editor),
        icon: ImagePlus,
        label: $t('ui.tiptap.toolbar.image'),
        ...(imageUpload
          ? {
              action: () => {},
              menu: {
                items: [
                  {
                    action: (editor) => {
                      if (typeof editor.commands.uploadImage === 'function') {
                        editor.commands.uploadImage();
                      }
                    },
                    label: $t('ui.tiptap.toolbar.imageUpload'),
                    shortLabel: 'UPL',
                  },
                  {
                    action: (editor) => handleImageAction(editor),
                    label: $t('ui.tiptap.toolbar.imageUrl'),
                    shortLabel: 'URL',
                  },
                ],
              },
            }
          : {}),
      },
    ],
    [
      {
        action: () => {},
        icon: Paintbrush,
        indicatorColor: (editor) =>
          editor.getAttributes('textStyle').color as string | undefined,
        isActive: (editor) => Boolean(editor.getAttributes('textStyle').color),
        label: $t('ui.tiptap.toolbar.textColor'),
        palette: {
          apply: (editor, color) =>
            editor.chain().focus().setColor(color).run(),
          clear: (editor) => editor.chain().focus().unsetColor().run(),
          colors: editorColorPresets,
          currentColor: (editor) =>
            editor.getAttributes('textStyle').color as string | undefined,
        },
      },
      {
        action: () => {},
        icon: Highlighter,
        indicatorColor: (editor) =>
          (editor.getAttributes('highlight').color as string | undefined) ??
          '#fef08a',
        isActive: (editor) => editor.isActive('highlight'),
        label: $t('ui.tiptap.toolbar.highlightColor'),
        palette: {
          apply: (editor, color) =>
            editor.chain().focus().setHighlight({ color }).run(),
          clear: (editor) => editor.chain().focus().unsetHighlight().run(),
          colors: editorHighlightPresets,
          currentColor: (editor) =>
            editor.getAttributes('highlight').color as string | undefined,
        },
      },
    ],
    [
      {
        action: (editor) => editor.chain().focus().setTextAlign('left').run(),
        can: (editor) =>
          editor.can().chain().focus().setTextAlign('left').run(),
        icon: AlignLeft,
        isActive: (editor) => editor.isActive({ textAlign: 'left' }),
        label: $t('ui.tiptap.toolbar.alignLeft'),
      },
      {
        action: (editor) => editor.chain().focus().setTextAlign('center').run(),
        can: (editor) =>
          editor.can().chain().focus().setTextAlign('center').run(),
        icon: AlignCenter,
        isActive: (editor) => editor.isActive({ textAlign: 'center' }),
        label: $t('ui.tiptap.toolbar.alignCenter'),
      },
      {
        action: (editor) => editor.chain().focus().setTextAlign('right').run(),
        can: (editor) =>
          editor.can().chain().focus().setTextAlign('right').run(),
        icon: AlignRight,
        isActive: (editor) => editor.isActive({ textAlign: 'right' }),
        label: $t('ui.tiptap.toolbar.alignRight'),
      },
    ],
  ];
}
