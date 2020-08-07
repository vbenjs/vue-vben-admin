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
    name: 'TableBaseDemo14',
    setup() {
      return () => {
        return (
          <div class="p-4 table-demo">
            <div>
              <BasicTable api={demoListApi} title="可编辑单元格示例" columns={columns}>
                <EditTableHeaderIcon slot="customId" title="Id" />
                <EditTableHeaderIcon slot="customName" title="姓名" />
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
