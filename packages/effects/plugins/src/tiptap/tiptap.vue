<script setup lang="ts">
import type {
  TipTapProps,
  ToolbarAction,
  VbenTiptapChangeEvent,
} from './types';

import { computed, onBeforeUnmount, watch } from 'vue';

import { Check, ChevronDown } from '@vben/icons';
import { $t } from '@vben/locales';

import { VbenIconButton, VbenPopover } from '@vben-core/shadcn-ui';
import { cn } from '@vben-core/shared/utils';

import { EditorContent, useEditor } from '@tiptap/vue-3';

import { createDefaultTiptapExtensions } from './extensions';
import { createToolbarGroups } from './toolbar';
import { useTiptapToolbar } from './use-tiptap-toolbar';

const props = withDefaults(defineProps<TipTapProps>(), {
  editable: true,
  extensions: undefined,
  minHeight: 240,
  placeholder: $t('ui.tiptap.placeholder'),
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
  'vben-tiptap__content',
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
            variant="ghost"
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
    </div>
    <EditorContent v-if="editor" :editor="editor" class="p-4" />
  </div>
</template>

<style scoped>
.vben-tiptap :deep(.vben-tiptap__content > * + *) {
  @apply mt-3;
}

.vben-tiptap :deep(.vben-tiptap__content h1) {
  @apply text-2xl font-bold leading-[1.4];
}

.vben-tiptap :deep(.vben-tiptap__content h2) {
  @apply text-xl font-bold leading-[1.45];
}

.vben-tiptap :deep(.vben-tiptap__content h3) {
  @apply text-lg font-semibold leading-[1.5];
}

.vben-tiptap :deep(.vben-tiptap__content h4) {
  @apply text-base font-semibold leading-[1.55];
}

.vben-tiptap :deep(.vben-tiptap__content ul) {
  @apply list-disc pl-6;
}

.vben-tiptap :deep(.vben-tiptap__content ol) {
  @apply list-decimal pl-6;
}

.vben-tiptap :deep(.vben-tiptap__content blockquote) {
  @apply border-l-4 border-primary pl-4 text-muted-foreground;
}

.vben-tiptap :deep(.vben-tiptap__content a) {
  @apply text-primary underline decoration-1 underline-offset-[3px];
}

.vben-tiptap :deep(.vben-tiptap__content code) {
  @apply rounded-[0.45rem] border border-border bg-secondary px-[0.35rem] py-[0.15rem] text-[0.9em] text-primary;
}

.vben-tiptap :deep(.vben-tiptap__content pre) {
  @apply overflow-x-auto rounded-[0.9rem] border border-border bg-popover p-4 text-popover-foreground;
}

.vben-tiptap :deep(.vben-tiptap__content pre code) {
  @apply border-none bg-transparent p-0 text-inherit;
}

.vben-tiptap :deep(.vben-tiptap__content img),
.vben-tiptap :deep(.vben-tiptap__content .vben-tiptap__image) {
  @apply my-4 block h-auto rounded-2xl border border-border;

  max-width: min(100%, 640px);
}

.vben-tiptap
  :deep(.vben-tiptap__content p.is-editor-empty:first-child::before) {
  float: left;
  height: 0;
  color: hsl(var(--input-placeholder));
  pointer-events: none;
  content: attr(data-placeholder);
}
</style>
