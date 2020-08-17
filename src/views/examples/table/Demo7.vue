<script lang="tsx">
  import { defineComponent } from 'compatible-vue';

  import { BasicTable, BasicColumn, useTable, FormProps } from '@/components/table/index';

  import { demoListApi } from '@/api/demo/table';
  import { getAdvanceSchema } from '../form/demoData';

  const columns: BasicColumn[] = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 120,
    },
    {
      title: '地址',
      dataIndex: 'address',
    },
    {
      title: '编号',
      dataIndex: 'no',
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
  const formConfig: Partial<FormProps> = {
    labelWidth: 100,
    schemas: getAdvanceSchema(6),
  };
  export default defineComponent({
    setup() {
      const [register] = useTable();
      return () => (
        <div class="p-4 table-demo">
          <div>
            <BasicTable
              useSearchForm
              formConfig={formConfig}
              onRegister={register}
              api={demoListApi}
              pagination={{
                pageSize: 20,
              }}
              title="开启搜索区域"
              titleHelpMessage={'温馨提醒'}
              rowSelection={{ type: 'radio' }}
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
