<script lang="tsx">
  import { defineComponent } from 'compatible-vue';

  import { BasicTable, BasicColumn, useTable } from '@/components/table/index';
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
      width: 80,
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
  const data: any = (() => {
    const arr: any = [];
    for (let index = 0; index < 40; index++) {
      arr.push({
        id: `${index}`,
        name: 'John Brown',
        age: `1${index}`,
        no: `${index + 10}`,
        address: 'New York No. 1 Lake ParkNew York No. 1 Lake Park',
        beginTime: new Date().toLocaleString(),
        endTime: new Date().toLocaleString(),
      });
    }
    return arr;
  })();
  export default defineComponent({
    name: 'TableBaseDemo1',
    setup() {
      const [register, { setProps }] = useTable({
        canResize: false,
      });
      return () => (
        <div class="p-4 table-demo">
          <div>
            <BasicTable
              onRegister={register}
              title="基础表格"
              titleHelpMessage={'温馨提醒'}
              columns={columns}
              dataSource={data}
            >
              <template slot="toolbar">
                <a-button
                  type="primary"
                  onClick={() => {
                    setProps({
                      rowSelection: {
                        type: 'radio',
                      },
                    });
                  }}
                >
                  显示单选
                </a-button>
                <a-button
                  type="primary"
                  onClick={() => {
                    setProps({
                      pagination: false,
                    });
                  }}
                >
                  隐藏分页
                </a-button>
                <a-button
                  type="primary"
                  onClick={() => {
                    setProps({
                      bordered: false,
                    });
                  }}
                >
                  隐藏边框
                </a-button>
                <a-button
                  type="primary"
                  onClick={() => {
                    setProps({
                      rowSelection: {
                        type: 'checkbox',
                      },
                    });
                  }}
                >
                  显示多选
                </a-button>
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
