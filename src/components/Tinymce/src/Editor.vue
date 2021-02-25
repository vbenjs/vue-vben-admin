<template>
  <div :class="prefixCls" :style="{ width: containerWidth }">
    <ImgUpload
      @uploading="handleImageUploading"
      @done="handleDone"
      v-if="showImageUpload"
      v-show="editorRef"
    />
    <textarea :id="tinymceId" ref="elRef" :style="{ visibility: 'hidden' }"></textarea>
  </div>
</template>

<script lang="ts">
  import {
    defineComponent,
    computed,
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
  import { shortUuid } from '/@/utils/uuid';
  import { bindHandlers } from './helper';
  import lineHeight from './lineHeight';
  import { onMountedOrActivated } from '/@/hooks/core/onMountedOrActivated';
  import ImgUpload from './ImgUpload.vue';
  import { useDesign } from '/@/hooks/web/useDesign';

  const CDN_URL = 'https://cdn.bootcdn.net/ajax/libs/tinymce/5.5.1';

  const tinymceScriptSrc = `${CDN_URL}/tinymce.min.js`;

  export default defineComponent({
    name: 'Tinymce',
    components: { ImgUpload },
    inheritAttrs: false,
    props: basicProps,
    emits: ['change', 'update:modelValue'],
    setup(props, { emit, attrs }) {
      const editorRef = ref<any>(null);
      const tinymceId = ref<string>(shortUuid('tiny-vue'));
      const elRef = ref<Nullable<HTMLElement>>(null);

      const { prefixCls } = useDesign('tinymce-container');

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
          base_url: CDN_URL,
          suffix: '.min',
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
      onMountedOrActivated(() => {
        tinymceId.value = shortUuid('tiny-vue');
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
          getTinymce()?.remove?.(unref(editorRef));
        }
      }

      function init() {
        toPromise().then(() => {
          setTimeout(() => {
            initEditor();
          }, 0);
        });
      }

      function initEditor() {
        getTinymce().PluginManager.add('lineHeight', lineHeight(getTinymce()));
        const el = unref(elRef);
        if (el) {
          el.style.visibility = '';
        }
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

      function setValue(editor: Recordable, val: string, prevVal?: string) {
        if (
          editor &&
          typeof val === 'string' &&
          val !== prevVal &&
          val !== editor.getContent({ format: attrs.outputFormat })
        ) {
          editor.setContent(val);
        }
      }

      function bindModelHandlers(editor: any) {
        const modelEvents = attrs.modelEvents ? attrs.modelEvents : null;
        const normalizedEvents = Array.isArray(modelEvents) ? modelEvents.join(' ') : modelEvents;

        watch(
          () => props.modelValue,
          (val: string, prevVal: string) => {
            setValue(editor, val, prevVal);
          }
        );

        watch(
          () => props.value,
          (val: string, prevVal: string) => {
            setValue(editor, val, prevVal);
          },
          {
            immediate: true,
          }
        );

        editor.on(normalizedEvents ? normalizedEvents : 'change keyup undo redo', () => {
          const content = editor.getContent({ format: attrs.outputFormat });
          emit('update:modelValue', content);
          emit('change', content);
        });
      }

      function handleImageUploading(name: string) {
        const editor = unref(editorRef);
        if (!editor) return;
        const content = editor?.getContent() ?? '';
        setValue(editor, `${content}\n${getImgName(name)}`);
      }

      function handleDone(name: string, url: string) {
        const editor = unref(editorRef);
        if (!editor) return;

        const content = editor?.getContent() ?? '';
        const val = content?.replace(getImgName(name), `<img src="${url}"/>`) ?? '';
        setValue(editor, val);
      }

      function getImgName(name: string) {
        return `[uploading:${name}]`;
      }

      return {
        prefixCls,
        containerWidth,
        initOptions,
        tinymceContent,
        tinymceScriptSrc,
        elRef,
        tinymceId,
        handleImageUploading,
        handleDone,
        editorRef,
      };
    },
  });
</script>

<style lang="less" scoped></style>

<style lang="less">
  @prefix-cls: ~'@{namespace}-tinymce-container';

  .@{prefix-cls} {
    position: relative;
    line-height: normal;

    textarea {
      z-index: -1;
      visibility: hidden;
    }
  }
</style>
