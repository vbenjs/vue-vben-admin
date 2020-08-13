<script lang="tsx">
  import { defineComponent } from 'compatible-vue';
  import { BasicTable, BasicColumn } from '@/components/table/index';
  import { BaseHelp } from '@/components/base/index';
  import { Icon } from '@/components/icon/index';
  import { demoListApi } from '@/api/demo/table';
  const columns: BasicColumn[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 200,
    },
    {
      // title: '姓名',
      dataIndex: 'name',
      width: 120,
      scopedSlots: { title: 'customTitle' },
    },
    {
      // title: '地址',
      dataIndex: 'address',
      scopedSlots: { title: 'customAddress' },
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
      return () => {
        return (
          <div class="p-4 table-demo">
            <div>
              <BasicTable
                api={demoListApi}
                title="定高/头部自定义"
                scroll={{ y: 300 }}
                columns={columns}
              >
                <span slot="customTitle">
                  姓名
                  <BaseHelp class="ml-2" text="姓名" />
                </span>
                <span slot="customAddress">
                  地址
                  <Icon class="ml-2" type="form" />
                </span>
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
