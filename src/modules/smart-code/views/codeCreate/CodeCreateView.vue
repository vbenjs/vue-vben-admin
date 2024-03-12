<template>
  <div class="full-height page-container">
    <div style="padding-bottom: 6px">
      <a-button type="primary" @click="handleDownloadAll">下载全部</a-button>
    </div>
    <a-tabs class="code-container">
      <a-tab-pane v-for="item in data" :key="item.templateId" :tab="item.templateName">
        <CodeEditor read-only :mode="item.language" :code="item.code" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, useAttrs } from 'vue';
  import { downloadByData } from '@/utils/file/download';
  import { CodeEditor } from '@/components/CodeEditor';
  import { ApiServiceEnum, defHttp } from '@/utils/http/axios';
  import { extensionLanguageMap } from '@/modules/smart-code/constants/Constants';

  const attrs = useAttrs();
  const data = ref<Array<any>>([]);
  const dataLoading = ref(false);
  /**
   * 下载全部
   */
  const handleDownloadAll = () => {
    data.value.forEach((item): any => {
      const filename = `${item.filename}.${extensionLanguageMap[item.language]}`;
      downloadByData(item.code, filename);
    });
  };

  /**
   * 加载数据函数
   */
  const loadData = async () => {
    dataLoading.value = true;
    try {
      data.value = await defHttp.post({
        service: ApiServiceEnum.SMART_CODE,
        url: 'db/code/main/createCode',
        data: Object.assign({}, attrs, {
          templateIdList: attrs.templateIdList?.split(','),
        }),
      });
    } finally {
      dataLoading.value = false;
    }
  };
  onMounted(loadData);
</script>

<style scoped lang="less">
  .code-container {
    height: calc(100% - 38px);
    border: 1px solid gainsboro;

    ::v-deep(.ant-tabs-content) {
      height: calc(100% - 60px);
    }
  }
</style>
