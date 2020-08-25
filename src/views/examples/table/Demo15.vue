<script lang="tsx">
  import { defineComponent } from 'compatible-vue';
  import {
    BasicTable,
    BasicColumn,
    renderEditableCell,
    EditTableHeaderIcon,
  } from '@/components/table/index';
  import { demoListApi } from '@/api/demo/table';

  const columns: BasicColumn[] = [
    {
      // title: 'ID',
      dataIndex: 'id',
      scopedSlots: { title: 'customId' },
      customRender: renderEditableCell({ dataIndex: 'id' }),
    },
    {
      // title: '姓名',
      dataIndex: 'name',
      scopedSlots: { title: 'customName' },
      customRender: renderEditableCell({
        dataIndex: 'name',
      }),
    },
    {
      title: '地址',
      dataIndex: 'address',
      sorter: true,
    },
  ];

  export default defineComponent({
    setup() {
      return () => {
        return (
          <div class="p-4 table-demo">
            <BasicTable
              api={demoListApi}
              title="可编辑单元格示例"
              columns={columns}
              showIndexColumn={false}
            >
              <EditTableHeaderIcon slot="customId" title="Id" />
              <EditTableHeaderIcon slot="customName" title="姓名" />
            </BasicTable>
          </div>
        );
      };
    },
  });
</script>
