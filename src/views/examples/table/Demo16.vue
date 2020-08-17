<script lang="tsx">
  import { defineComponent } from 'compatible-vue';
  import { BasicTable, BasicColumn } from '@/components/table/index';
  import { demoListApi } from '@/api/demo/table';

  const columns: BasicColumn[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 300,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 500,
    },
    {
      title: '地址',
      dataIndex: 'address',
      sorter: true,
      width: 500,
    },
    {
      title: '编号',
      dataIndex: 'no',
      width: 500,
    },
    {
      title: '开始时间',
      dataIndex: 'beginTime',
      width: 300,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      width: 200,
    },
  ];

  export default defineComponent({
    setup() {
      function handleSummary(tableData: any[]) {
        const totalNo = tableData.reduce((prev, next) => {
          prev += next.no;
          return prev;
        }, 0);
        return [
          {
            no: totalNo,
          },
        ];
      }
      return () => {
        return (
          <div class="p-4 table-demo">
            <div>
              <BasicTable
                rowSelection={{ type: 'checkbox' }}
                showSummary={true}
                summaryFunc={handleSummary}
                scroll={{ x: 2000 }}
                api={demoListApi}
                title="表尾行合计示例"
                columns={columns}
              ></BasicTable>
            </div>
          </div>
        );
      };
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
