<script lang="tsx">
  import { defineComponent } from 'compatible-vue';
  import { BasicTable, BasicColumn } from '@/components/table/index';
  import { demoListApi } from '@/api/demo/table';

  const renderContent = (value, row, index) => {
    const obj: any = {
      children: value,
      attrs: {},
    };
    if (index === 9) {
      obj.attrs.colSpan = 0;
    }
    return obj;
  };
  const columns: BasicColumn[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 300,
      customRender: renderContent,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 300,
      customRender: renderContent,
    },
    {
      title: '地址',
      dataIndex: 'address',
      colSpan: 2,
      width: 120,
      sorter: true,
      customRender: (value, row, index) => {
        const obj: any = {
          children: value,
          attrs: {},
        };
        if (index === 2) {
          obj.attrs.rowSpan = 2;
        }
        if (index === 3) {
          obj.attrs.colSpan = 0;
        }
        return obj;
      },
    },
    {
      title: '编号',
      dataIndex: 'no',
      colSpan: 0,
      filters: [
        { text: 'Male', value: 'male' },
        { text: 'Female', value: 'female' },
      ],
      customRender: renderContent,
    },
    {
      title: '开始时间',
      dataIndex: 'beginTime',
      width: 200,
      customRender: renderContent,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      width: 200,
      customRender: renderContent,
    },
  ];

  export default defineComponent({
    name: 'TableBaseDemo13',
    setup() {
      return () => {
        return (
          <div class="p-4 table-demo">
            <div>
              <BasicTable api={demoListApi} title="合并行列示例" columns={columns}></BasicTable>
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
