<!--
 * @Description: 导入JSON模板
-->
<template>
  <Modal
    title="JSON数据"
    :open="visible"
    @ok="handleImportJson"
    @cancel="handleCancel"
    cancelText="关闭"
    :destroyOnClose="true"
    wrapClassName="v-code-modal"
    style="top: 20px"
    :width="850"
  >
    <p class="hint-box">导入格式如下:</p>
    <div class="v-json-box">
      <CodeEditor v-model:value="json" ref="myEditor" :mode="MODE.JSON" />
    </div>

    <template #footer>
      <a-button @click="handleCancel">取消</a-button>
      <Upload
        class="upload-button"
        :beforeUpload="beforeUpload"
        :showUploadList="false"
        accept="application/json"
      >
        <a-button type="primary">导入json文件</a-button>
      </Upload>
      <a-button type="primary" @click="handleImportJson">确定</a-button>
    </template>
  </Modal>
</template>
<script lang="ts">
  import { defineComponent, reactive, toRefs } from 'vue';
  // import message from '../../../utils/message';
  import { useFormDesignState } from '../../../hooks/useFormDesignState';
  // import { codemirror } from 'vue-codemirror-lite';
  import { IFormConfig } from '../../../typings/v-form-component';
  import { formItemsForEach, generateKey } from '../../../utils';
  import { CodeEditor, MODE } from '/@/components/CodeEditor';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Upload, Modal } from 'ant-design-vue';

  export default defineComponent({
    name: 'ImportJsonModal',
    components: {
      CodeEditor,
      Upload,
      Modal,
    },
    setup() {
      const { createMessage } = useMessage();

      const state = reactive({
        visible: false,
        json: `{
  "schemas": [
    {
      "component": "input",
      "label": "输入框",
      "field": "input_2",
      "span": 24,
      "props": {
        "type": "text"
      }
    }
  ],
  "layout": "horizontal",
  "labelLayout": "flex",
  "labelWidth": 100,
  "labelCol": {},
  "wrapperCol": {}
}`,
        jsonData: {
          schemas: {},
          config: {},
        },
        handleSetSelectItem: null,
      });
      const { formDesignMethods } = useFormDesignState();
      const handleCancel = () => {
        state.visible = false;
      };
      const showModal = () => {
        state.visible = true;
      };
      const handleImportJson = () => {
        // 导入JSON
        try {
          const editorJsonData = JSON.parse(state.json) as IFormConfig;
          editorJsonData.schemas &&
            formItemsForEach(editorJsonData.schemas, (formItem) => {
              generateKey(formItem);
            });
          formDesignMethods.setFormConfig({
            ...editorJsonData,
            activeKey: 1,
            currentItem: { component: '' },
          });
          handleCancel();
          createMessage.success('导入成功');
        } catch {
          createMessage.error('导入失败，数据格式不对');
        }
      };
      const beforeUpload = (e: File) => {
        // 通过json文件导入
        const reader = new FileReader();
        reader.readAsText(e);
        reader.onload = function () {
          state.json = this.result as string;
          handleImportJson();
        };
        return false;
      };

      return {
        handleImportJson,
        beforeUpload,
        handleCancel,
        showModal,
        ...toRefs(state),
        MODE,
      };
    },
  });
</script>

<style lang="less" scoped>
  .upload-button {
    margin: 0 10px;
  }
</style>
