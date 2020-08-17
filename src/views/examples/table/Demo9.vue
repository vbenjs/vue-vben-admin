<script lang="tsx">
  import { defineComponent } from 'compatible-vue';

  import { BasicTable, BasicColumn, useTable } from '@/components/table/index';

  import { demoListApi } from '@/api/demo/table';
  const columns: BasicColumn[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 120,
    },
    {
      title: '地址',
      dataIndex: 'address',
      width: 120,
    },
    {
      title: '编号',
      dataIndex: 'no',
      width: 120,
    },
    {
      title: '开始时间',
      dataIndex: 'beginTime',
      width: 120,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      width: 120,
    },
  ];

  export default defineComponent({
    setup() {
      const [register] = useTable();
      return () => (
        <div class="p-4 table-demo">
          <div>
            <BasicTable
              bordered={true}
              onRegister={register}
              api={demoListApi}
              title="列拖拽示例（必须在column设置width）"
              columns={columns}
              canColDrag={true}
            ></BasicTable>
          </div>
        </div>
      );
    },
  });
</script>
<style lang="less" scoped>
  .table-demo {
    & > div {
      background: #fff;
    }
  }
</style>
