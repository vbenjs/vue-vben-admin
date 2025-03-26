<script setup lang="ts">
import type { AiEditorOptions } from 'aieditor';

import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

import { usePreferences } from '@vben/preferences';

import { AiEditor } from 'aieditor';

import { mergeAIEditorOptions } from './init';

const props = defineProps<{
  options?: Omit<AiEditorOptions, 'element'>;
}>();

const editorRef = ref<HTMLElement>();
const editorInstance = ref<AiEditor>();
const modelValue = defineModel<string>();
const preference = usePreferences();

const localMap = {
  'zh-CN': 'zh',
  'en-US': 'en',
};
const lang = computed(() => localMap[preference.locale.value]);
const theme = computed(() => preference.theme.value);

const editorConfig = computed((): AiEditorOptions => {
  return {
    ...mergeAIEditorOptions(props.options),
    element: editorRef.value as HTMLElement,
    content: modelValue.value,
    lang: lang.value,
    theme: theme.value,
    onChange: (editor: AiEditor) => {
      modelValue.value = editor.getHtml();
      props.options?.onChange?.(editor);
    },
  };
});

onMounted(() => {
  nextTick(() => {
    editorInstance.value = new AiEditor(editorConfig.value);
  });
});

onUnmounted(() => {
  editorInstance.value?.destroy();
});

watch(
  [() => editorConfig.value.theme, () => editorConfig.value.lang],
  ([theme, lang]) => {
    editorInstance.value?.changeTheme(theme);
    editorInstance.value?.changeLang(localMap[lang]);
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <div ref="editorRef"></div>
</template>

<style scoped>
:deep(.aie-container) {
  height: 100%;
  min-height: 300px;
}

:deep(.tippy-box) {
  background-color: transparent;
}
</style>
