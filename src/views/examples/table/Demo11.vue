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
      slots: { title: 'customTitle' },
    },
    {
      title: '地址',
      dataIndex: 'address',
      width: 120,
      sorter: true,
    },

    {
      title: '编号',
      dataIndex: 'no',
      width: 120,
      filters: [
        { text: 'Male', value: 'male' },
        { text: 'Female', value: 'female' },
      ],
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
    name: 'TableBaseDemo11',
    setup() {
      const [register] = useTable();
      return () => {
        return (
          <div class="p-4 table-demo">
            <div>
              <BasicTable
                onRegister={register}
                api={demoListApi}
                title="定高/头部自定义"
                scroll={{ y: 300 }}
                columns={columns}
              >
                <span slot="customTitle"> Name</span>
              </BasicTable>
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
