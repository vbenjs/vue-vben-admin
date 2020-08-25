<script lang="tsx">
  import { defineComponent } from 'compatible-vue';
  import { BasicTable, BasicColumn } from '@/components/table/index';
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
      children: [
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
      ],
    },
  ];

  export default defineComponent({
    setup() {
      return () => {
        return (
          <div class="p-4 table-demo">
            <BasicTable api={demoListApi} title="多级表头示例" columns={columns}></BasicTable>
          </div>
        );
      };
    },
  });
</script>
