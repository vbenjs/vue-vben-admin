<script lang="tsx">
  import { defineComponent } from 'compatible-vue';

  import { BasicTable, TableAction } from '@/components/table/index';
  import { Button } from 'ant-design-vue';
  const columns: any[] = [
    {
      title: 'name',
      dataIndex: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      width: 80,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      ellipsis: true,
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
    },
  ];
  const data: any = (() => {
    const arr: any = [];
    for (let index = 0; index < 20; index++) {
      arr.push({
        id: `${index}`,
        name: 'John Brown',
        age: `1${index}`,
        address: 'New York No. 1 Lake ParkNew York No. 1 Lake Park',
        tags: ['nice', 'developer'],
      });
    }
    return arr;
  })();
  export default defineComponent({
    name: 'TableBaseDemo',
    setup() {
      return () => (
        <div class="p-4 table-demo">
          <div>
            <BasicTable
              title={() => {
                return '123';
              }}
              titleHelpMessage={'温馨提醒'}
              rowSelection={{ type: 'radio' }}
              columns={columns}
              dataSource={data}
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
                              console.log('======================');
                              console.log(111);
                              console.log('======================');
                            },
                          },
                        },
                      ]}
                      dropDownActions={[
                        {
                          label: '删除',
                          on: {
                            click: () => {
                              console.log('======================');
                              console.log(111);
                              console.log('======================');
                            },
                          },
                        },
                      ]}
                    ></TableAction>
                  );
                },
              }}
            >
              <template slot="toolbar">
                <Button type="primary">编辑</Button>
                <Button type="primary">新增</Button>
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
