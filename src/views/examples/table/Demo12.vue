<script lang="tsx">
  import { defineComponent } from 'compatible-vue';

  import { BasicTable, BasicColumn, useTable } from '@/components/table/index';

  import { demoListApi } from '@/api/demo/table';
  const columns: BasicColumn[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 200,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 120,
    },
    {
      title: '地址',
      dataIndex: 'address',
      sorter: true,
    },

    // {
    //   title: '编号',
    //   dataIndex: 'no',
    //   width: 120,
    //   filters: [
    //     { text: 'Male', value: 'male' },
    //     { text: 'Female', value: 'female' },
    //   ],
    // },
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
      return () => {
        return (
          <div class="p-4 table-demo">
            <BasicTable
              onRegister={register}
              api={demoListApi}
              title="展开行自定义"
              scroll={{ y: 300 }}
              columns={columns}
              scopedSlots={{
                expandedRowRender: (r) => {
                  return r.no;
                },
              }}
            />
          </div>
        );
      };
    },
  });
</script>
