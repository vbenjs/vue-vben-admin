<template>
  <div class="tinymce-container" :style="{ width: containerWidth }">
    <tinymce-editor
      :id="id"
      :init="initOptions"
      :modelValue="tinymceContent"
      @update:modelValue="handleChange"
      :tinymceScriptSrc="tinymceScriptSrc"
    ></tinymce-editor>
  </div>
</template>

<script lang="ts">
  import TinymceEditor from './lib'; // TinyMCE vue wrapper
  import { defineComponent, computed } from 'vue';
  import { basicProps } from './props';
  import toolbar from './toolbar';
  import plugins from './plugins';

  const CDN_URL = 'https://cdn.bootcdn.net/ajax/libs/tinymce/5.5.1';
  const tinymceScriptSrc = `${CDN_URL}/tinymce.min.js`;

  export default defineComponent({
    name: 'Tinymce',
    components: { TinymceEditor },
    props: basicProps,
    setup(props, { emit }) {
      const tinymceContent = computed(() => {
        return props.value;
      });
      function handleChange(value: string) {
        emit('change', value);
      }
      const containerWidth = computed(() => {
        const width = props.width;
        // Test matches `100`, `'100'`
        if (/^[\d]+(\.[\d]+)?$/.test(width.toString())) {
          return `${width}px`;
        }
        return width;
      });
      const initOptions = computed(() => {
        const { id, height, menubar } = props;
        return {
          selector: `#${id}`,
          height: height,
          toolbar: toolbar,
          menubar: menubar,
          plugins: plugins,
          // 语言包
          language_url: 'resource/tinymce/langs/zh_CN.js',
          // 中文
          language: 'zh_CN',
        };
      });
      return { containerWidth, initOptions, tinymceContent, handleChange, tinymceScriptSrc };
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
