<template>
  <div class="full-height" style=" height: 100%;padding: 10px">
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

<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';

  import { CodeEditor } from '@/components/CodeEditor';

  import { downloadByData } from '@/utils/file/download';

  import { extensionLanguageMap } from './CodeCreateSupport';
  import { ApiServiceEnum, defHttp } from '@/utils/http/axios';

  /**
   * 代码生成页面
   */
  export default defineComponent({
    name: 'CodeCreateView',
    components: {
      CodeEditor,
    },
    // @ts-ignore
    setup(props, { attrs }: any) {
      const data = ref<Array<any>>([]);
      const dataLoading = ref(false);
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
              templateIdList: attrs.templateIdList.split(','),
            }),
          });
        } finally {
          dataLoading.value = false;
        }
      };
      /**
       * 下载全部
       */
      const handleDownloadAll = () => {
        data.value.forEach((item): any => {
          const filename = `${item.filename}.${extensionLanguageMap[item.language]}`;
          downloadByData(item.code, filename);
        });
      };
      onMounted(loadData);
      return {
        data,
        handleDownloadAll,
      };
    },
  });
</script>

<style lang="less" scoped>
  .code-container {
    height: calc(100% - 38px);
    border: 1px solid gainsboro;

    ::v-deep(.ant-tabs-content) {
      height: calc(100% - 60px);
    }
  }
</style>
