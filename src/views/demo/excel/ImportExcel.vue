<template>
  <PageWrapper title="excel数据导入示例">
    <ImpExcel @success="loadDataSuccess">
      <a-button class="m-3"> 导入Excel </a-button>
    </ImpExcel>
    <BasicTable
      v-for="(table, index) in tableListRef"
      :key="index"
      :title="table.title"
      :columns="table.columns"
      :dataSource="table.dataSource"
    />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';

  import { ImpExcel, ExcelData } from '/@/components/Excel';
  import { BasicTable, BasicColumn } from '/@/components/Table';
  import { PageWrapper } from '/@/components/Page';

  export default defineComponent({
    components: { BasicTable, ImpExcel, PageWrapper },

    setup() {
      const tableListRef = ref<
        {
          title: string;
          columns?: any[];
          dataSource?: any[];
        }[]
      >([]);

      function loadDataSuccess(excelDataList: ExcelData[]) {
        tableListRef.value = [];
        console.log(excelDataList);
        for (const excelData of excelDataList) {
          const {
            header,
            results,
            meta: { sheetName },
          } = excelData;
          const columns: BasicColumn[] = [];
          for (const title of header) {
            columns.push({ title, dataIndex: title });
          }
          tableListRef.value.push({ title: sheetName, dataSource: results, columns });
        }
      }

      return {
        loadDataSuccess,
        tableListRef,
      };
    },
  });
</script>
