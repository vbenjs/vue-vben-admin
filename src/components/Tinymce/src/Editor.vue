<template>
  <div :class="prefixCls" :style="{ width: containerWidth }">
    <ImgUpload
      :fullscreen="fullscreen"
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

  import tinymce from 'tinymce/tinymce';
  import 'tinymce/skins/ui/oxide/skin.min.css';
  import 'tinymce/themes/silver';

  import toolbar from './toolbar';
  import plugins from './plugins';

  import { buildShortUUID } from '/@/utils/uuid';
  import { bindHandlers } from './helper';
  import { onMountedOrActivated } from '/@/hooks/core/onMountedOrActivated';
  import ImgUpload from './ImgUpload.vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { isNumber } from '/@/utils/is';

  import 'tinymce/icons/default/icons';
  import 'tinymce/themes/mobile';
  import 'tinymce/plugins/emoticons';
  import 'tinymce/plugins/emoticons/js/emojis';
  import 'tinymce/plugins/advlist';
  import 'tinymce/plugins/anchor';
  import 'tinymce/plugins/autolink';
  import 'tinymce/plugins/autosave';
  import 'tinymce/plugins/code';
  import 'tinymce/plugins/codesample';
  import 'tinymce/plugins/directionality';
  import 'tinymce/plugins/fullscreen';
  import 'tinymce/plugins/hr';
  import 'tinymce/plugins/image';
  import 'tinymce/plugins/imagetools';
  import 'tinymce/plugins/insertdatetime';
  import 'tinymce/plugins/link';
  import 'tinymce/plugins/lists';
  import 'tinymce/plugins/media';
  import 'tinymce/plugins/nonbreaking';
  import 'tinymce/plugins/noneditable';
  import 'tinymce/plugins/pagebreak';
  import 'tinymce/plugins/paste';
  import 'tinymce/plugins/preview';
  import 'tinymce/plugins/print';
  import 'tinymce/plugins/save';
  import 'tinymce/plugins/searchreplace';
  import 'tinymce/plugins/spellchecker';
  import 'tinymce/plugins/tabfocus';
  import 'tinymce/plugins/table';
  import 'tinymce/plugins/template';
  import 'tinymce/plugins/textpattern';
  import 'tinymce/plugins/visualblocks';
  import 'tinymce/plugins/visualchars';
  import 'tinymce/plugins/wordcount';

  const tinymceProps = {
    options: {
      type: Object as PropType<any>,
      default: {},
    },
    value: {
      type: String,
    },

    toolbar: {
      type: Array as PropType<string[]>,
      default: toolbar,
    },
    plugins: {
      type: Array as PropType<string[]>,
      default: plugins,
    },
    modelValue: {
      type: String,
    },
    height: {
      type: [Number, String] as PropType<string | number>,
      required: false,
      default: 400,
    },

    width: {
      type: [Number, String] as PropType<string | number>,
      required: false,
      default: 'auto',
    },
    showImageUpload: {
      type: Boolean,
      default: true,
    },
  };

  export default defineComponent({
    name: 'Tinymce',
    components: { ImgUpload },
    inheritAttrs: false,
    props: tinymceProps,
    emits: ['change', 'update:modelValue'],
    setup(props, { emit, attrs }) {
      const editorRef = ref<any>(null);
      const fullscreen = ref(false);
      const tinymceId = ref<string>(buildShortUUID('tiny-vue'));
      const elRef = ref<Nullable<HTMLElement>>(null);

      const { prefixCls } = useDesign('tinymce-container');

      const tinymceContent = computed(() => {
        return props.modelValue;
      });

      const containerWidth = computed(() => {
        const width = props.width;
        if (isNumber(width)) {
          return `${width}px`;
        }
        return width;
      });

      const initOptions = computed(() => {
        const { height, options, toolbar, plugins } = props;
        return {
          selector: `#${unref(tinymceId)}`,
          height,
          toolbar,
          menubar: 'file edit insert view format table',
          plugins,
          language_url: '/resource/tinymce/langs/zh_CN.js',
          language: 'zh_CN',
          branding: false,
          default_link_target: '_blank',
          link_title: false,
          advlist_bullet_styles: 'square',
          advlist_number_styles: 'default',
          object_resizing: false,
          skin: 'oxide',
          skin_url: 'resource/tinymce/skins/ui/oxide',
          content_css: 'resource/tinymce/skins/content/default/content.css',
          ...options,
          setup: (editor: any) => {
            editorRef.value = editor;
            editor.on('init', (e: Event) => initSetup(e));
          },
        };
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
        tinymceId.value = buildShortUUID('tiny-vue');
        nextTick(() => {
          setTimeout(() => {
            initEditor();
          }, 30);
        });
      });

      onUnmounted(() => {
        destory();
      });

      onDeactivated(() => {
        destory();
      });

      function destory() {
        if (tinymce !== null) {
          tinymce?.remove?.(unref(editorRef));
        }
      }

      function initEditor() {
        const el = unref(elRef);
        if (el) {
          el.style.visibility = '';
        }
        tinymce.init(unref(initOptions));
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

        editor.on('FullscreenStateChanged', (e) => {
          fullscreen.value = e.state;
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
        elRef,
        tinymceId,
        handleImageUploading,
        handleDone,
        editorRef,
        fullscreen,
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
