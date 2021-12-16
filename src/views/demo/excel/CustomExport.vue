<template>
  <PageWrapper title="导出示例" content="可以选择导出格式">
    <BasicTable title="基础表格" :columns="columns" :dataSource="data">
      <template #toolbar>
        <a-button @click="openModal"> 导出 </a-button>
        <a-button
          v-excel="exportExcelObj"
          :pre-icon="exportExcelObj.isLoading ? '' : 'ant-design:download-outlined'"
          :loading="exportExcelObj.isLoading"
        >
          接口导出
        </a-button>
      </template>
    </BasicTable>
    <ExpExcelModal @register="register" @success="defaultHeader" />
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, reactive } from 'vue';
  import { BasicTable } from '/@/components/Table';
  import {
    jsonToSheetXlsx,
    ExpExcelModal,
    ExportModalResult,
    ExportExcel,
  } from '/@/components/Excel';
  import { columns, data } from './data';
  import { useModal } from '/@/components/Modal';
  import { PageWrapper } from '/@/components/Page';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { exportExcel } from '/@/api/demo/system';

  export default defineComponent({
    components: { BasicTable, ExpExcelModal, PageWrapper },
    setup() {
      const { createErrorModal } = useMessage();
      //如果要测试导出excel请cmd到tests/server目录下，运行npm run start，然后点击下载按钮
      const exportExcelObj = reactive<ExportExcel>({
        api: exportExcel,
        params: {
          key: 'value',
        },
        fileName: '通过接口导出Excel.xlsx',
        beginDownloadFn: function () {
          exportExcelObj.isLoading = true;
          return exportExcelObj.params;
        },
        downLoadComplete: function () {
          exportExcelObj.isLoading = false;
        },
        isLoading: false,
        downloadErrorFn: function () {
          createErrorModal({
            title: '下载失败',
            content: '下载失败',
          });
        },
      });
      function defaultHeader({ filename, bookType }: ExportModalResult) {
        // 默认Object.keys(data[0])作为header
        jsonToSheetXlsx({
          data,
          filename,
          write2excelOpts: {
            bookType,
          },
        });
      }
      const [register, { openModal }] = useModal();

      return {
        defaultHeader,
        columns,
        data,
        register,
        openModal,
        exportExcelObj,
      };
    },
  });
</script>
