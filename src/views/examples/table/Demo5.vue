<script lang="tsx">
  import { defineComponent } from 'compatible-vue';

  import { BasicTable, BasicColumn, useTable, TableAction } from '@/components/table/index';

  import { demoListApi } from '@/api/demo/table';
  const columns: BasicColumn[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      fixed: 'left',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 120,
    },
    {
      title: '地址',
      dataIndex: 'address',
      width: 600,
    },
    {
      title: '编号',
      dataIndex: 'no',
      width: 600,
    },
    {
      title: '开始时间',
      dataIndex: 'beginTime',
      width: 400,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      width: 400,
    },
  ];

  export default defineComponent({
    name: 'TableBaseDemo5',
    setup() {
      const [register] = useTable();
      return () => (
        <div class="p-4 table-demo">
          <div>
            <BasicTable
              onRegister={register}
              api={demoListApi}
              pagination={{
                pageSize: 20,
              }}
              title="TableAction组件及固定列示例"
              titleHelpMessage={'温馨提醒'}
              rowSelection={{ type: 'radio' }}
              columns={columns}
              actionColumn={{
                width: 160,
                title: 'Action',
                dataIndex: 'action',
                customRender: () => {
                  return (
                    <TableAction
                      actions={[
                        {
                          label: '删除',
                          on: {
                            click: () => {
                              console.log('点击了删除');
                            },
                          },
                        },
                      ]}
                      dropDownActions={[
                        {
                          label: '启用',
                          on: {
                            click: () => {
                              console.log('点击了启用');
                            },
                          },
                        },
                      ]}
                    ></TableAction>
                  );
                },
              }}
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
