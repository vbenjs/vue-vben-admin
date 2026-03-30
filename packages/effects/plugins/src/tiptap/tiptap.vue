<script setup lang="ts">
import type {
  TipTapProps,
  ToolbarAction,
  VbenTiptapChangeEvent,
} from './types';

import { computed, onBeforeUnmount, watch } from 'vue';

import { Check, ChevronDown, Eye } from '@vben/icons';
import { $t } from '@vben/locales';

import { useVbenModal } from '@vben-core/popup-ui';
import { VbenIconButton, VbenPopover } from '@vben-core/shadcn-ui';
import { cn } from '@vben-core/shared/utils';

import { EditorContent, useEditor } from '@tiptap/vue-3';

import { createDefaultTiptapExtensions } from './extensions';
import Preview from './preview.vue';
import { createToolbarGroups } from './toolbar';
import { useTiptapToolbar } from './use-tiptap-toolbar';

import './style.css';
const props = withDefaults(defineProps<TipTapProps>(), {
  editable: true,
  extensions: undefined,
  minHeight: 240,
  placeholder: $t('ui.tiptap.placeholder'),
  previewable: true,
  toolbar: true,
});
const emit = defineEmits<{
  change: [payload: VbenTiptapChangeEvent];
}>();
const modelValue = defineModel<string>({ default: '' });
const contentMinHeight = computed(() =>
  typeof props.minHeight === 'number'
    ? `${props.minHeight}px`
    : props.minHeight,
);
const tiptapContentClass = cn(
  'vben-tiptap-content vben-tiptap__content',
  'min-h-(--vben-tiptap-min-height) leading-7 text-foreground outline-none',
);
const editor = useEditor({
  content: modelValue.value,
  editable: props.editable,
  editorProps: {
    attributes: {
      class: tiptapContentClass,
    },
  },
  extensions:
    props.extensions ??
    createDefaultTiptapExtensions({
      placeholder: props.placeholder,
    }),
  onUpdate: ({ editor }) => {
    const html = editor.getHTML();
    if (html !== modelValue.value) {
      modelValue.value = html;
    }
    emit('change', {
      html,
      json: editor.getJSON(),
      text: editor.getText(),
    });
  },
});
const toolbarGroups = computed<ToolbarAction[][]>(() => {
  return createToolbarGroups();
});
const previewContent = computed(
  () => editor.value?.getHTML() ?? modelValue.value,
);
const [PreviewModal, previewModalApi] = useVbenModal({
  footer: false,
  fullscreenButton: false,
});
const {
  applyPaletteColor,
  canRunAction,
  canRunMenuItem,
  clearPaletteColor,
  getActionIndicatorColor,
  getMenuItemClass,
  getPaletteCurrentColor,
  getPaletteSwatchClass,
  getToolbarButtonClass,
  isMenuItemActive,
  runAction,
  runMenuItem,
} = useTiptapToolbar({
  editable: () => props.editable,
  editor,
});
function openPreviewModal() {
  previewModalApi.open();
}
watch(
  () => props.editable,
  (editable) => {
    editor.value?.setEditable(editable);
  },
);
watch(
  () => modelValue.value,
  (nextValue = '') => {
    if (!editor.value) {
      return;
    }
    const currentValue = editor.value.getHTML();
    if (nextValue === currentValue) {
      return;
    }
    editor.value.commands.setContent(nextValue, {
      emitUpdate: false,
    });
  },
);
onBeforeUnmount(() => {
  editor.value?.destroy();
});
</script>

<template>
  <div
    :style="{ '--vben-tiptap-min-height': contentMinHeight }"
    class="vben-tiptap overflow-hidden rounded-xl border border-border bg-card"
  >
    <div
      v-if="toolbar"
      class="sticky top-0 z-10 flex flex-wrap items-center gap-2 border-b border-border p-2 backdrop-blur-[14px]"
    >
      <div
        v-for="(group, groupIndex) in toolbarGroups"
        :key="groupIndex"
        class="flex items-center gap-1"
      >
        <template v-for="action in group" :key="action.label">
          <VbenPopover
            v-if="action.menu || action.palette"
            :content-props="{ align: 'start', side: 'bottom', sideOffset: 8 }"
            content-class="w-auto p-2"
          >
            <template #trigger>
              <VbenIconButton
                :aria-label="action.label"
                :class="getToolbarButtonClass(action)"
                :disabled="!canRunAction(action)"
                :tooltip="action.label"
                tooltip-side="top"
                variant="ghost"
              >
                <template v-if="action.triggerText">
                  <span class="text-xs font-semibold tracking-wide">
                    {{
                      typeof action.triggerText === 'function'
                        ? action.triggerText(editor)
                        : action.triggerText
                    }}
                  </span>
                  <ChevronDown class="size-4 opacity-70" />
                </template>
                <component
                  v-else-if="action.icon"
                  :is="action.icon"
                  class="size-4"
                />
                <span
                  v-if="getActionIndicatorColor(action)"
                  :style="{ backgroundColor: getActionIndicatorColor(action) }"
                  class="absolute bottom-1 left-1/2 h-1 w-4 -translate-x-1/2 rounded-full shadow-[0_0_0_1px_hsl(var(--card)/0.7)]"
                ></span>
              </VbenIconButton>
            </template>
            <div
              v-if="action.palette"
              class="flex max-w-52 flex-wrap items-center gap-2"
            >
              <button
                v-for="color in action.palette.colors"
                :key="color"
                :aria-label="`${action.label}-${color}`"
                :class="getPaletteSwatchClass(action, color)"
                :style="{ backgroundColor: color }"
                type="button"
                @click="applyPaletteColor(action, color)"
              >
                <Check
                  v-if="getPaletteCurrentColor(action) === color"
                  class="size-4 text-white drop-shadow-sm"
                />
              </button>
              <button
                v-if="action.palette.clear"
                class="h-8 w-full rounded-xl border border-border bg-secondary text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                type="button"
                @click="clearPaletteColor(action)"
              >
                {{ $t('ui.tiptap.toolbar.clear') }}
              </button>
            </div>
            <div v-else-if="action.menu" class="flex min-w-32 flex-col gap-1">
              <button
                v-for="item in action.menu.items"
                :key="item.shortLabel"
                :class="getMenuItemClass(item)"
                :disabled="!canRunMenuItem(item)"
                type="button"
                @click="runMenuItem(item)"
              >
                <span class="w-7 text-xs font-semibold tracking-wide">
                  {{ item.shortLabel }}
                </span>
                <span class="flex-1">{{ item.label }}</span>
                <Check
                  v-if="isMenuItemActive(item)"
                  class="size-4 text-primary"
                />
              </button>
            </div>
          </VbenPopover>
          <VbenIconButton
            v-else
            :aria-label="action.label"
            :class="getToolbarButtonClass(action)"
            :disabled="!canRunAction(action)"
            :tooltip="action.label"
            tooltip-side="top"
            @click="runAction(action)"
          >
            <component :is="action.icon" class="size-4" />
            <span
              v-if="getActionIndicatorColor(action)"
              :style="{ backgroundColor: getActionIndicatorColor(action) }"
              class="absolute bottom-1 left-1/2 h-1 w-4 -translate-x-1/2 rounded-full shadow-[0_0_0_1px_hsl(var(--card)/0.7)]"
            ></span>
          </VbenIconButton>
        </template>
        <div
          v-if="groupIndex < toolbarGroups.length - 1"
          class="ml-1 h-5 w-px bg-border"
        ></div>
      </div>
      <div v-if="previewable" class="ml-auto flex items-center">
        <VbenIconButton
          :aria-label="$t('ui.tiptap.toolbar.preview')"
          :class="
            getToolbarButtonClass({
              action: () => {},
              label: $t('ui.tiptap.toolbar.preview'),
            })
          "
          :tooltip="$t('ui.tiptap.toolbar.preview')"
          tooltip-side="top"
          variant="ghost"
          @click="openPreviewModal"
        >
          <Eye class="size-4" />
        </VbenIconButton>
      </div>
    </div>
    <EditorContent v-if="editor" :editor="editor" class="p-4" />
    <PreviewModal
      v-if="previewable"
      :title="$t('ui.tiptap.toolbar.preview')"
      class="w-4/5"
    >
      <Preview :content="previewContent" :min-height="320" />
    </PreviewModal>
  </div>
</template>

<style scoped>
.vben-tiptap
  :deep(.vben-tiptap__content p.is-editor-empty:first-child::before) {
  float: left;
  height: 0;
  color: hsl(var(--input-placeholder));
  pointer-events: none;
  content: attr(data-placeholder);
}
</style>
