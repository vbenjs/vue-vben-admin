<script lang="tsx">
  import { defineComponent } from 'compatible-vue';

  import { BasicTable, BasicColumn, TableImg } from '@/components/table/index';
  import { Tag } from 'ant-design-vue';
  import { demoListApi } from '@/api/demo/table';
  const columns: BasicColumn[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      customRender: () => {
        return <div>id</div>;
      },
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 120,
    },
    {
      title: '头像',
      dataIndex: 'img',
      width: 120,
      // @ts-ignore
      customRender: (text: string, record: any, index: index) => {
        // 这里数据可以用
        return (
          <TableImg
            imgList={['https://picsum.photos/id/66/346/216', 'https://picsum.photos/id/67/346/216']}
          ></TableImg>
        );
      },
    },
    {
      title: '地址',
      dataIndex: 'address',
    },
    {
      title: '编号',
      dataIndex: 'no',
      customRender: () => {
        return <Tag color="green">no</Tag>;
      },
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

  export default defineComponent({
    name: 'TableBaseDemo6',
    setup() {
      return () => (
        <div class="p-4 table-demo">
          <div>
            <BasicTable
              api={demoListApi}
              pagination={{
                pageSize: 20,
              }}
              title="自定义列内容"
              titleHelpMessage={'温馨提醒'}
              columns={columns}
            ></BasicTable>
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
