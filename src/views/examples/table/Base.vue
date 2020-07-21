<script lang="tsx">
  import { defineComponent } from 'compatible-vue';

  import { BasicTable } from '@/components/table/index';
  const columns: any[] = [
    {
      title: 'name',
      dataIndex: 'name',
      key: 'name',
      width: 100,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      width: 200,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      width: 200,
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      width: 200,
    },
    {
      title: 'Action',
      key: 'action',
      dataIndex: 'action',
      width: 200,
    },
  ];
  const data: any = (() => {
    const arr: any = [];
    for (let index = 0; index < 20; index++) {
      arr.push({
        key: `${index}`,
        name: 'John Brown',
        age: `1${index}`,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
      });
    }
    return arr;
  })();
  export default defineComponent({
    name: 'TableBaseDemo',
    setup() {
      return () => (
        <div class="p-4 table-demo">
          <div>
            <BasicTable columns={columns} dataSource={data}></BasicTable>
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
