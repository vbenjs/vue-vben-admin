<script lang="tsx">
  import { defineComponent, ref, unref } from 'compatible-vue';

  import { Checkbox } from 'ant-design-vue';
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
    },
    {
      title: '地址',
      dataIndex: 'address',
      width: 120,
    },
    {
      title: '编号',
      dataIndex: 'no',
      width: 120,
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
  const options = columns.map((item) => {
    return {
      label: item.title,
      value: item.dataIndex as string,
    };
  });
  export default defineComponent({
    setup() {
      const [register, { setColumns }] = useTable();
      const selectKeysRef = ref<string[] | number[]>(options.map((item) => item.value));

      function handleSelectChange(checkedList: string[]) {
        setColumns(checkedList);
        selectKeysRef.value = checkedList;
      }
      return () => {
        return (
          <div class="p-4 table-demo">
            <Checkbox.Group
              value={unref(selectKeysRef)}
              options={options}
              onChange={handleSelectChange}
            />
            <div>
              <BasicTable
                onRegister={register}
                api={demoListApi}
                title="动态列示例"
                columns={columns}
              />
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
