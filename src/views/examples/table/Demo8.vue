<script lang="tsx">
  import { defineComponent } from 'compatible-vue';

  import { BasicTable, BasicColumn, useTable } from '@/components/table/index';

  import { demoListApi } from '@/api/demo/table';
  const columns: BasicColumn[] = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 120,
    },
    {
      title: '地址',
      dataIndex: 'address',
    },
    {
      title: '编号',
      dataIndex: 'no',
    },
    {
      title: '开始时间',
      dataIndex: 'beginTime',
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
    },
  ];

  export default defineComponent({
    setup() {
      const [register] = useTable();
      return () => (
        <div class="p-4 table-demo">
          <div>
            <BasicTable
              onRegister={register}
              api={demoListApi}
              title="行拖拽示例（拖动行可以进行排序）"
              columns={columns}
              canRowDrag={true}
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
