<template>
  <PageWrapper title="导出示例" content="根据数组格式的数据进行导出">
    <BasicTable title="基础表格" :columns="columns" :dataSource="data">
      <template #toolbar>
        <a-button @click="aoaToExcel"> 导出 </a-button>
        <a-button @click="aoaToMultipleSheet" danger> 导出多Sheet </a-button>
      </template>
    </BasicTable>
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTable } from '/@/components/Table';
  import { aoaToSheetXlsx } from '/@/components/Excel';
  import { arrHeader, arrData, columns, data } from './data';
  import { PageWrapper } from '/@/components/Page';
  import { aoaToMultipleSheetXlsx } from '/@/components/Excel/src/Export2Excel';

  export default defineComponent({
    components: { BasicTable, PageWrapper },
    setup() {
      function aoaToExcel() {
        // 保证data顺序与header一致
        aoaToSheetXlsx({
          data: arrData,
          header: arrHeader,
          filename: '二维数组方式导出excel.xlsx',
        });
      }
      function aoaToMultipleSheet() {
        // 保证data顺序与header一致
        aoaToMultipleSheetXlsx({
          sheetList: [
            {
              data: arrData,
              header: arrHeader,
              sheetName: 'Sheet1',
            },
            {
              data: arrData,
              header: arrHeader,
              sheetName: 'Sheet2',
            },
          ],
          filename: '二维数组方式导出excel-多Sheet示例.xlsx',
        });
      }

      return {
        aoaToExcel,
        aoaToMultipleSheet,
        columns,
        data,
      };
    },
  });
</script>
