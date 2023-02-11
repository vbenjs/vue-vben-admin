<template>
  <div>
    <div class="v-json-box">
      <CodeEditor :value="editorJson" ref="myEditor" :mode="MODE.JSON" />
    </div>
    <div class="copy-btn-box">
      <a-button
        @click="handleCopyJson"
        type="primary"
        class="copy-btn"
        data-clipboard-action="copy"
        :data-clipboard-text="editorJson"
      >
        复制数据
      </a-button>
      <a-button @click="handleExportJson" type="primary">导出代码</a-button>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, toRefs, unref } from 'vue';
  import { CodeEditor, MODE } from '/@/components/CodeEditor';

  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  import { useMessage } from '/@/hooks/web/useMessage';
  export default defineComponent({
    name: 'PreviewCode',
    components: {
      CodeEditor,
    },
    props: {
      fileFormat: {
        type: String,
        default: 'json',
      },
      editorJson: {
        type: String,
        default: '',
      },
    },
    setup(props) {
      const state = reactive({
        visible: false,
      });

      const exportData = (data: string, fileName = `file.${props.fileFormat}`) => {
        let content = 'data:text/csv;charset=utf-8,';
        content += data;
        const encodedUri = encodeURI(content);
        const actions = document.createElement('a');
        actions.setAttribute('href', encodedUri);
        actions.setAttribute('download', fileName);
        actions.click();
      };

      const handleExportJson = () => {
        exportData(props.editorJson);
      };
      const { clipboardRef, copiedRef } = useCopyToClipboard();
      const { createMessage } = useMessage();

      const handleCopyJson = () => {
        // 复制数据
        const value = props.editorJson;
        if (!value) {
          createMessage.warning('代码为空！');
          return;
        }
        clipboardRef.value = value;
        if (unref(copiedRef)) {
          createMessage.warning('复制成功！');
        }
      };

      return {
        ...toRefs(state),
        exportData,
        handleCopyJson,
        handleExportJson,
        MODE,
      };
    },
  });
</script>

<style lang="less" scoped>
  // modal复制按钮样式
  .copy-btn-box {
    padding-top: 8px;
    text-align: center;

    .copy-btn {
      margin-right: 8px;
    }
  }
</style>
