import type { AiEditorOptions } from 'aieditor';

import type { VbenAIEditorProps } from './types';

import {
  computed,
  defineComponent,
  h,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue';

import { usePreferences } from '@vben/preferences';

import { AiEditor } from 'aieditor';

import { mergeAIEditorOptions } from './init';
import BaseVbenAiEditor from './use-ai-editor.vue';

export function useAiEditor(options?: VbenAIEditorProps) {
  const editor = ref<AiEditor | null>();
  const editorRef = ref<HTMLElement | string>();

  const preference = usePreferences();

  const localMap = {
    'zh-CN': 'zh',
    'en-US': 'en',
  };

  const editorConfig = computed(() => {
    return {
      ...mergeAIEditorOptions(options),
      element: editorRef.value as HTMLElement,
      lang: localMap[preference.locale.value],
      theme: preference.theme.value,
    };
  });

  const isDark = computed(() => preference.theme.value === 'dark');

  watch(
    [() => preference.theme.value, () => preference.locale.value],
    ([theme, lang]) => {
      editor.value?.changeTheme(theme);
      editor.value?.changeLang(localMap[lang]);
    },
    {
      immediate: true,
    },
  );

  const VbenAiEditor = defineComponent({
    setup(props: VbenAIEditorProps, { attrs, slots }) {
      onMounted(() => {
        nextTick(() => {
          editor.value = new AiEditor(editorConfig.value as AiEditorOptions);
        });
      });

      onBeforeUnmount(() => {
        editor.value?.destroy();
      });

      return () => {
        return h('div', { ref: editorRef }, [
          h(
            BaseVbenAiEditor,
            {
              ...props,
              ...attrs,
              isDark: isDark.value,
              width: options?.width,
              height: options?.height,
            },
            slots,
          ),
        ]);
      };
    },
    extraOptions() {
      return {
        inheritAttrs: false,
        name: 'VbenAiEditor',
      };
    },
  });

  return [VbenAiEditor, editor] as const;
}
