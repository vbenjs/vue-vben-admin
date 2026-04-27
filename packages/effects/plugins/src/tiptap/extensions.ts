import type { Editor as CoreEditor } from '@tiptap/core';
import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import type { EditorView } from '@tiptap/pm/view';
import type { Extensions } from '@tiptap/vue-3';

import type { ImageUploadOptions, VbenTiptapExtensionOptions } from './types';

import { $t } from '@vben/locales';

import { alert } from '@vben-core/popup-ui';

import Document from '@tiptap/extension-document';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { Color, TextStyle } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import StarterKit from '@tiptap/starter-kit';

const DEFAULT_ACCEPT = 'image/*';

function validateFile(
  file: File,
  options: ImageUploadOptions,
): string | undefined {
  if (options.maxSize !== undefined && file.size > options.maxSize) {
    return $t('ui.tiptap.upload.fileTooLarge');
  }

  const accept = options.accept ?? DEFAULT_ACCEPT;
  if (accept && accept !== '*/*' && accept !== 'image/*') {
    const acceptedTypes = accept.split(',').map((t) => t.trim());
    const isAccepted = acceptedTypes.some((type) => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -1));
      }
      return file.type === type;
    });
    if (!isAccepted) {
      return $t('ui.tiptap.upload.fileTypeNotAllowed');
    }
  }

  return undefined;
}

function handleUploadError(error: unknown, options: ImageUploadOptions): void {
  if (options.onUploadError) {
    options.onUploadError(error);
  } else {
    const message = error instanceof Error ? error.message : String(error);
    alert(message, $t('ui.tiptap.upload.uploadFailed')).catch(() => {});
  }
}

interface UploadContext {
  blobUrl: string;
  pos: number;
}

function createUploadProcess(
  editor: CoreEditor,
  file: File,
  options: ImageUploadOptions,
  blobUrlTracker?: Set<string>,
  pos?: number,
): UploadContext {
  const blobUrl = URL.createObjectURL(file);
  blobUrlTracker?.add(blobUrl);
  const insertPos = pos ?? editor.state.selection.from;

  // Insert placeholder image with blob URL
  editor
    .chain()
    .insertContentAt(insertPos, {
      attrs: {
        'data-upload-progress': 0,
        'data-uploading': 'true',
        src: blobUrl,
      },
      type: 'image',
    })
    .run();

  // Find the node we just inserted to track its position
  let nodePos = insertPos;
  const { doc } = editor.state;
  doc.descendants((node: ProseMirrorNode, offset: number) => {
    if (
      node.type.name === 'image' &&
      node.attrs.src === blobUrl &&
      node.attrs['data-uploading'] === 'true'
    ) {
      nodePos = offset;
      return false;
    }
  });

  const uploadContext: UploadContext = { blobUrl, pos: nodePos };

  options
    .upload(file, (percent: number) => {
      // Update progress attribute on the placeholder image
      const currentState = editor.state;
      let currentPos = -1;
      currentState.doc.descendants((node: ProseMirrorNode, offset: number) => {
        if (
          node.type.name === 'image' &&
          node.attrs.src === blobUrl &&
          node.attrs['data-uploading'] === 'true'
        ) {
          currentPos = offset;
          return false;
        }
      });

      if (currentPos === -1) return;

      const node = currentState.doc.nodeAt(currentPos);
      if (!node) return;

      const transaction = currentState.tr.setNodeMarkup(currentPos, undefined, {
        ...node.attrs,
        'data-upload-progress': percent,
      });
      editor.view.dispatch(transaction);
    })
    .then((url: string) => {
      // Replace blob URL with real URL and remove uploading attributes
      const currentState = editor.state;
      let currentPos = -1;
      currentState.doc.descendants((node: ProseMirrorNode, offset: number) => {
        if (
          node.type.name === 'image' &&
          node.attrs.src === blobUrl &&
          node.attrs['data-uploading'] === 'true'
        ) {
          currentPos = offset;
          return false;
        }
      });

      if (currentPos === -1) {
        blobUrlTracker?.delete(blobUrl);
        URL.revokeObjectURL(blobUrl);
        return;
      }

      const node = currentState.doc.nodeAt(currentPos);
      if (!node) {
        blobUrlTracker?.delete(blobUrl);
        URL.revokeObjectURL(blobUrl);
        return;
      }

      const transaction = currentState.tr.setNodeMarkup(currentPos, undefined, {
        ...node.attrs,
        'data-upload-progress': null,
        'data-uploading': null,
        src: url,
      });
      editor.view.dispatch(transaction);
      blobUrlTracker?.delete(blobUrl);
      URL.revokeObjectURL(blobUrl);
    })
    .catch((error: unknown) => {
      // Remove placeholder image on failure
      const currentState = editor.state;
      let currentPos = -1;
      currentState.doc.descendants((node: ProseMirrorNode, offset: number) => {
        if (
          node.type.name === 'image' &&
          node.attrs.src === blobUrl &&
          node.attrs['data-uploading'] === 'true'
        ) {
          currentPos = offset;
          return false;
        }
      });

      if (currentPos !== -1) {
        const transaction = currentState.tr.delete(
          currentPos,
          currentPos + (currentState.doc.nodeAt(currentPos)?.nodeSize ?? 1),
        );
        editor.view.dispatch(transaction);
      }

      URL.revokeObjectURL(blobUrl);
      blobUrlTracker?.delete(blobUrl);
      handleUploadError(error, options);
    });

  return uploadContext;
}

function createCustomImage(
  imageUpload: ImageUploadOptions,
  blobUrlTracker?: Set<string>,
) {
  return Image.extend({
    addAttributes() {
      return {
        ...this.parent?.(),
        'data-upload-progress': {
          default: null,
          parseHTML: (element) => element.dataset.uploadProgress,
          renderHTML: (attributes) => {
            if (
              attributes['data-upload-progress'] === null ||
              attributes['data-upload-progress'] === undefined
            )
              return {};
            return {
              'data-upload-progress': attributes['data-upload-progress'],
            };
          },
        },
        'data-uploading': {
          default: null,
          parseHTML: (element) => element.dataset.uploading,
          renderHTML: (attributes) => {
            if (!attributes['data-uploading']) return {};
            return { 'data-uploading': attributes['data-uploading'] };
          },
        },
      };
    },

    addNodeView() {
      return ({ node }) => {
        const isUploading = node.attrs['data-uploading'] === 'true';

        if (!isUploading) {
          return null as any;
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'vben-tiptap-upload-wrapper';

        const img = document.createElement('img');
        img.src = node.attrs.src;
        img.className = 'vben-tiptap__image';
        wrapper.append(img);

        const spinner = document.createElement('div');
        spinner.className = 'vben-tiptap-upload-spinner';
        wrapper.append(spinner);

        const progressBar = document.createElement('div');
        progressBar.className = 'vben-tiptap-upload-progress';
        const progressFill = document.createElement('div');
        progressFill.className = 'vben-tiptap-upload-progress-fill';
        progressBar.append(progressFill);
        wrapper.append(progressBar);

        const progress = node.attrs['data-upload-progress'];
        if (progress !== null && progress !== undefined && progress > 0) {
          spinner.style.display = 'none';
          progressBar.style.display = '';
          progressFill.style.width = `${progress}%`;
        } else {
          spinner.style.display = '';
          progressBar.style.display = 'none';
        }

        return {
          dom: wrapper,
          update(updatedNode: ProseMirrorNode) {
            if (updatedNode.attrs['data-uploading'] !== 'true') {
              return false;
            }

            if (updatedNode.attrs.src !== img.src) {
              img.src = updatedNode.attrs.src;
            }

            const newProgress = updatedNode.attrs['data-upload-progress'];
            if (
              newProgress !== null &&
              newProgress !== undefined &&
              newProgress > 0
            ) {
              spinner.style.display = 'none';
              progressBar.style.display = '';
              progressFill.style.width = `${newProgress}%`;
            } else {
              spinner.style.display = '';
              progressBar.style.display = 'none';
            }

            return true;
          },
        } as any;
      };
    },

    addCommands() {
      return {
        ...this.parent?.(),
        uploadImage:
          () =>
          ({ editor: cmdEditor }: { editor: CoreEditor }) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = imageUpload.accept ?? DEFAULT_ACCEPT;
            input.style.display = 'none';

            input.addEventListener('change', () => {
              const file = input.files?.[0];
              if (!file) return;

              const error = validateFile(file, imageUpload);
              if (error) {
                handleUploadError(new Error(error), imageUpload);
                return;
              }

              createUploadProcess(cmdEditor, file, imageUpload, blobUrlTracker);
              input.remove();
            });

            document.body.append(input);
            input.click();
          },
      };
    },

    addProseMirrorPlugins() {
      const editor = this.editor;

      return [
        new Plugin({
          key: new PluginKey('imageUploadDrop'),
          props: {
            handleDrop: (view: EditorView, event: DragEvent) => {
              if (!event.dataTransfer?.files.length) return false;

              const file = event.dataTransfer.files[0];
              if (!file || !file.type.startsWith('image/')) return false;

              event.preventDefault();

              const error = validateFile(file, imageUpload);
              if (error) {
                handleUploadError(new Error(error), imageUpload);
                return true;
              }

              // Calculate drop position
              const coordinates = view.posAtCoords({
                left: event.clientX,
                top: event.clientY,
              });

              const pos = coordinates?.pos ?? view.state.selection.from;

              createUploadProcess(
                editor,
                file,
                imageUpload,
                blobUrlTracker,
                pos,
              );
              return true;
            },
          },
        }),
        new Plugin({
          key: new PluginKey('imageUploadPaste'),
          props: {
            handlePaste: (_view: EditorView, event: ClipboardEvent) => {
              const items = event.clipboardData?.items;
              if (!items) return false;

              let imageFile: File | undefined;
              for (const item of items) {
                if (item.type.startsWith('image/')) {
                  imageFile = item.getAsFile() ?? undefined;
                  break;
                }
              }

              if (!imageFile) return false;

              event.preventDefault();

              const error = validateFile(imageFile, imageUpload);
              if (error) {
                handleUploadError(new Error(error), imageUpload);
                return true;
              }

              createUploadProcess(
                editor,
                imageFile,
                imageUpload,
                blobUrlTracker,
              );
              return true;
            },
          },
        }),
      ];
    },
  });
}

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
    options.imageUpload
      ? createCustomImage(
          options.imageUpload,
          options._blobUrlTracker,
        ).configure({
          allowBase64: true,
          HTMLAttributes: {
            class: 'vben-tiptap__image',
          },
        })
      : Image.configure({
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
