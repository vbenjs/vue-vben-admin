<script lang="tsx">
  import { defineComponent } from 'compatible-vue';

  import { BasicTable, BasicColumn, useTable } from '@/components/table/index';
  import { useMessage } from '@/hooks/core/useMessage';
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
    for (let index = 0; index < 100; index++) {
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
    setup() {
      const { createMessage } = useMessage();
      const [
        register,
        {
          getSelectRows,
          setTableData,
          getPaginationRef,
          setSelectedRowKeys,
          getDataSource,
          clearSelectedRowKeys,
        },
      ] = useTable({
        pagination: {
          pageSize: 50,
        },
        rowSelection: {
          type: 'checkbox',
        },
      });
      return () => (
        <div class="p-4 table-demo">
          <BasicTable
            onRegister={register}
            title="响应式高度/及分页器配置"
            titleHelpMessage={'温馨提醒'}
            columns={columns}
            dataSource={data}
          >
            <template slot="toolbar">
              <a-button
                type="primary"
                onClick={() => {
                  createMessage.success(JSON.stringify(getSelectRows()));
                }}
              >
                获取选中行
              </a-button>
              <a-button
                type="primary"
                onClick={() => {
                  const allData = getDataSource();
                  setSelectedRowKeys([allData[0].__ROW__KEY__]);
                }}
              >
                设置选中行
              </a-button>
              <a-button
                type="primary"
                onClick={() => {
                  clearSelectedRowKeys();
                }}
              >
                清空选中行
              </a-button>

              <a-button
                type="primary"
                onClick={() => {
                  setTableData([
                    {
                      id: 1,
                      name: 'John Brown',
                      age: 11,
                      no: 1111,
                      address: 'New York No. 1 Lake ParkNew York No. 1 Lake Park',
                      beginTime: new Date().toLocaleString(),
                      endTime: new Date().toLocaleString(),
                    },
                  ]);
                }}
              >
                设置表格数据
              </a-button>
              <a-button
                type="primary"
                onClick={() => {
                  createMessage.success(JSON.stringify(getPaginationRef()));
                }}
              >
                获取当前分页信息
              </a-button>
            </template>
          </BasicTable>
        </div>
      );
    },
  });
</script>
