<script lang="ts" setup>
  import { ref } from 'vue';

  import { Tabs, TabPane, Row as ARow, Col as ACol } from 'ant-design-vue';

  import { CodeEditor } from '/@/components/CodeEditor';

  import { keys } from 'lodash-es';

  import { PreviewResponse } from '/@/apis/code';

  const props = defineProps<{ preview: PreviewResponse }>();

  const activeTable = ref<string>(keys(props.preview)[0]);
  const activeCode = ref<string>(props.preview[activeTable.value][0].name);

  const emit = defineEmits(['download', 'redo']);

  async function redo() {
    emit('redo');
  }

  async function download() {
    emit('download');
  }
</script>
<template>
  <div>
    <tabs tab-position="left" v-model:activeKey="activeTable">
      <tab-pane v-for="table in keys(props.preview)" :key="table" :tab="table">
        <tabs tab-position="top" v-model:activeKey="activeCode">
          <tab-pane v-for="code in props.preview[table]" :key="code.name" :tab="code.name">
            <code-editor :value="code.content" readonly />
          </tab-pane>
        </tabs>
      </tab-pane>
    </tabs>
    <a-row justify="center">
      <a-col span="6"><a-button @click="download"> 下载 </a-button></a-col>
      <a-col span="6"><a-button type="primary" @click="redo"> 重新生成 </a-button></a-col>
    </a-row>
  </div>
</template>
