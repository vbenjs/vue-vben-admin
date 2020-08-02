<script lang="tsx">
  import { defineComponent, reactive } from 'compatible-vue';
  import { useDesign } from '@/hooks/core/useDesign';
  import { Button } from 'ant-design-vue';
  import { ImportFromExcel, ExcelData } from '@/components/excel/index';
  import { BasicTable, BasicColumn } from '@/components/table/index';

  export default defineComponent({
    name: 'ImportFromExcelDemo',
    setup() {
      const { prefixCls } = useDesign('index');
      const tableState = reactive<{
        columns: BasicColumn[];
        dataSource: any[];
        title: string;
      }>({
        columns: [],
        dataSource: [],
        title: '',
      });

      function loadDataInTable(excelData: ExcelData) {
        console.log(excelData);
        tableState.columns.length = 0;
        for (const header of excelData.header) {
          tableState.columns.push({ title: header, dataIndex: header });
        }
        tableState.title = excelData.meta.sheetName;
        tableState.dataSource = excelData.results;
      }

      // function handleBeforeUpload(file){}
      return () => {
        return (
          <div class={prefixCls}>
            <ImportFromExcel onSuccess={loadDataInTable}>
              <Button class="m-3">导入Excel</Button>
            </ImportFromExcel>
            <BasicTable
              title={tableState.title}
              columns={tableState.columns}
              dataSource={tableState.dataSource}
            ></BasicTable>
          </div>
        );
      };
    },
  });
</script>
<style scoped lang="less">
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-index';

  .@{prefix-cls} {
    position: relative;
    background: #fff;
  }
</style>
