<template>
  <div class="tinymce-container" :style="{ width: containerWidth }">
    <textarea :id="tinymceId" visibility="hidden" ref="elRef"></textarea>
  </div>
</template>

<script lang="ts">
  import {
    defineComponent,
    computed,
    onMounted,
    nextTick,
    ref,
    unref,
    watch,
    onUnmounted,
    onDeactivated,
  } from 'vue';
  import { basicProps } from './props';
  import toolbar from './toolbar';
  import plugins from './plugins';
  import { getTinymce } from './getTinymce';
  import { useScript } from '/@/hooks/web/useScript';
  import { snowUuid } from '/@/utils/uuid';
  import { bindHandlers } from './helper';
  // import lineHeight from './lineHeight';

  const CDN_URL = 'https://cdn.bootcdn.net/ajax/libs/tinymce/5.5.1';

  const tinymceScriptSrc = `${CDN_URL}/tinymce.min.js`;

  export default defineComponent({
    name: 'Tinymce',
    props: basicProps,
    emits: ['change', 'update:modelValue'],
    setup(props, { emit, attrs }) {
      const editorRef = ref<any>(null);
      const elRef = ref<Nullable<HTMLElement>>(null);

      const tinymceId = computed(() => {
        return snowUuid('tiny-vue');
      });

      const tinymceContent = computed(() => {
        return props.modelValue;
      });

      const containerWidth = computed(() => {
        const width = props.width;
        if (/^[\d]+(\.[\d]+)?$/.test(width.toString())) {
          return `${width}px`;
        }
        return width;
      });

      const initOptions = computed(() => {
        const { height, options } = props;
        return {
          selector: `#${unref(tinymceId)}`,
          height: height,
          toolbar: toolbar,
          menubar: 'file edit insert view format table',
          plugins: plugins,
          // 语言包
          language_url: 'resource/tinymce/langs/zh_CN.js',
          // 中文
          language: 'zh_CN',
          default_link_target: '_blank',
          link_title: false,
          advlist_bullet_styles: 'square',
          advlist_number_styles: 'default',
          object_resizing: false,
          fontsize_formats: '10px 11px 12px 14px 16px 18px 20px 24px 36px 48px',
          lineheight_formats: '1 1.5 1.75 2.0 3.0 4.0 5.0',
          ...options,
          setup: (editor: any) => {
            editorRef.value = editor;
            editor.on('init', (e: Event) => initSetup(e));
          },
        };
      });

      const { toPromise } = useScript({
        src: tinymceScriptSrc,
      });

      watch(
        () => attrs.disabled,
        () => {
          const editor = unref(editorRef);
          if (!editor) return;
          editor.setMode(attrs.disabled ? 'readonly' : 'design');
        }
      );

      onMounted(() => {
        nextTick(() => {
          init();
        });
      });

      onUnmounted(() => {
        destory();
      });

      onDeactivated(() => {
        destory();
      });

      function destory() {
        if (getTinymce() !== null) {
          getTinymce().remove(unref(editorRef));
        }
      }

      function init() {
        toPromise().then(() => {
          initEditor();
        });
      }

      function initEditor() {
        // getTinymce().PluginManager.add('lineHeight', lineHeight(getTinymce()));
        getTinymce().init(unref(initOptions));
      }

      function initSetup(e: Event) {
        const editor = unref(editorRef);
        if (!editor) return;
        const value = props.modelValue || '';

        editor.setContent(value);
        bindModelHandlers(editor);
        bindHandlers(e, attrs, unref(editorRef));
      }

      function bindModelHandlers(editor: any) {
        const modelEvents = attrs.modelEvents ? attrs.modelEvents : null;
        const normalizedEvents = Array.isArray(modelEvents) ? modelEvents.join(' ') : modelEvents;
        watch(
          () => props.modelValue,
          (val: string, prevVal: string) => {
            if (
              editor &&
              typeof val === 'string' &&
              val !== prevVal &&
              val !== editor.getContent({ format: attrs.outputFormat })
            ) {
              editor.setContent(val);
            }
          }
        );

        editor.on(normalizedEvents ? normalizedEvents : 'change keyup undo redo', () => {
          emit('update:modelValue', editor.getContent({ format: attrs.outputFormat }));
        });
      }

      function handleChange(value: string) {
        emit('change', value);
      }
      return {
        containerWidth,
        initOptions,
        tinymceContent,
        handleChange,
        tinymceScriptSrc,
        elRef,
        tinymceId,
      };
    },
  });
</script>

<style lang="less" scoped>
  .tinymce-container {
    position: relative;
    line-height: normal;

    .mce-fullscreen {
      z-index: 10000;
    }
  }

  .editor-custom-btn-container {
    position: absolute;
    top: 6px;
    right: 6px;

    &.fullscreen {
      position: fixed;
      z-index: 10000;
    }
  }

  .editor-upload-btn {
    display: inline-block;
  }

  textarea {
    z-index: -1;
    visibility: hidden;
  }
</style>
