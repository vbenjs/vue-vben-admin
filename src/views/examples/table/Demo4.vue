<script lang="tsx">
  import { defineComponent } from 'compatible-vue';

  import { BasicTable, BasicColumn, useTable } from '@/components/table/index';
  import { Button } from 'ant-design-vue';

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
    name: 'TableBaseDemo4',
    setup() {
      const [register, { reload }] = useTable();
      return () => (
        <div class="p-4 table-demo">
          <div>
            <BasicTable
              onRegister={register}
              api={demoListApi}
              pagination={{
                pageSize: 20,
              }}
              title="远程加载示例标题"
              titleHelpMessage={'温馨提醒'}
              rowSelection={{ type: 'radio' }}
              columns={columns}
            >
              {' '}
              <template slot="toolbar">
                <Button
                  type="primary"
                  onClick={() => {
                    reload({
                      searchInfo: {
                        a: 111,
                      },
                    });
                  }}
                >
                  刷新表格(当前页)
                </Button>

                <Button
                  type="primary"
                  onClick={() => {
                    reload({
                      page: 1,
                    });
                  }}
                >
                  刷新表格(返回第一页)
                </Button>
              </template>
            </BasicTable>
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
