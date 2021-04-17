<template>
  <div class="relative h-100 !h-full w-full overflow-hidden" ref="el"> </div>
</template>

<script lang="ts">
  import {
    ref,
    onMounted,
    onUnmounted,
    watchEffect,
    watch,
    defineComponent,
    unref,
    nextTick,
  } from 'vue';
  import { useDebounceFn } from '@vueuse/core';
  import { useAppStore } from '/@/store/modules/app';

  import CodeMirror from 'codemirror';
  import './codemirror.css';
  import 'codemirror/theme/idea.css';
  import 'codemirror/theme/material-palenight.css';

  // modes
  import 'codemirror/mode/javascript/javascript';
  import 'codemirror/mode/css/css';
  import 'codemirror/mode/htmlmixed/htmlmixed';
  export default defineComponent({
    props: {
      mode: {
        type: String,
        default: 'application/json',
      },
      value: {
        type: String,
        default: '',
      },
      readonly: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['change'],
    setup(props, { emit }) {
      const el = ref();
      let editor: Nullable<CodeMirror.Editor>;

      const debounceRefresh = useDebounceFn(refresh, 100);
      const appStore = useAppStore();

      watch(
        () => props.value,
        async (v) => {
          await nextTick();
          const oldValue = editor?.getValue();
          v && v !== oldValue && editor?.setValue(v);
        },
        { flush: 'post' }
      );

      watchEffect(() => {
        editor?.setOption('mode', props.mode);
      });

      watch(
        () => appStore.getDarkMode,
        async () => {
          setTheme();
        },
        {
          immediate: true,
        }
      );

      function setTheme() {
        unref(editor)?.setOption(
          'theme',
          appStore.getDarkMode === 'light' ? 'idea' : 'material-palenight'
        );
      }

      function refresh() {
        editor?.refresh();
      }

      async function init() {
        const addonOptions = {
          autoCloseBrackets: true,
          autoCloseTags: true,
          foldGutter: true,
          gutters: ['CodeMirror-linenumbers'],
        };

        editor = CodeMirror(el.value!, {
          value: '',
          mode: props.mode,
          readOnly: props.readonly,
          tabSize: 2,
          theme: 'material-palenight',
          lineWrapping: true,
          lineNumbers: true,
          ...addonOptions,
        });
        editor?.setValue(props.value);
        setTheme();
        editor?.on('change', () => {
          emit('change', editor?.getValue());
        });
      }

      onMounted(async () => {
        await nextTick();
        init();
        window.addEventListener('resize', debounceRefresh);
        setTimeout(refresh, 50);
      });

      onUnmounted(() => {
        window.removeEventListener('resize', debounceRefresh);
        editor = null;
      });
      return { el };
    },
  });
</script>
