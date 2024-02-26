<template>
  <BasicModal
    title="生成代码"
    defaultFullscreen
    :wrapClassName="prefixCls"
    @register="registerModal"
    @ok="handleDownloadAll"
    okText="下载全部"
  >
    <a-tabs class="full-height">
      <a-tab-pane v-for="item in dataRef" :key="item.templateId" :tab="item.templateName">
        <CodeEditor readonly :value="item.code" />
      </a-tab-pane>
    </a-tabs>
  </BasicModal>
</template>
<script setup lang="ts">
  import type { CodeCreatedModel } from '@/modules/codeGenerator/types';

  import { BasicModal, useModalInner } from '@/components/Modal';
  import { ref } from 'vue';
  import { ApiServiceEnum, defHttp } from '@/utils/http/axios';
  import { CodeEditor } from '@/components/CodeEditor';
  import { useDesign } from '@/hooks/web/useDesign';
  import { extensionLanguageMap } from '@/modules/codeGenerator/constants/Constants';
  import { downloadByData } from '@/utils/file/download';

  const { prefixCls } = useDesign('smart-tool-code-codeCreateResult');

  const [registerModal, { changeLoading, closeModal }] = useModalInner((data: CodeCreatedModel) => {
    loadData(data);
  });
  const dataRef = ref<Array<any>>([]);

  /**
   * 加载数据函数
   */
  const loadData = async (data: CodeCreatedModel) => {
    try {
      changeLoading(true);
      dataRef.value = await defHttp.post({
        service: ApiServiceEnum.SMART_CODE,
        url: 'db/code/main/createCode',
        data,
      });
    } finally {
      changeLoading(false);
    }
  };

  /**
   * 下载全部
   */
  const handleDownloadAll = () => {
    dataRef.value.forEach((item): any => {
      const filename = `${item.filename}.${extensionLanguageMap[item.language]}`;
      downloadByData(item.code, filename);
    });
    closeModal();
  };
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-smart-tool-code-codeCreateResult';

  .@{prefix-cls} {
    .ant-tabs-content {
      height: 100%;
    }
  }
</style>
