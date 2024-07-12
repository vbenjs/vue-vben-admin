<template>
  <div>
    <BasicTable @register="registerTable" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';

  import { BasicTable, useTable } from '@/components/Table';
  import { getOperateLogList } from '@/api/demo/system';

  import { useDrawer } from '@/components/Drawer';

  import { columns, searchFormSchema } from './operate-log-data';
  import { useI18n } from '@/hooks/web/useI18n';

  export default defineComponent({
    name: 'OperateLogManagement',
    components: { BasicTable },
    setup() {
      const { t } = useI18n();
      const [registerDrawer] = useDrawer();
      const [registerTable, { reload }] = useTable({
        title: `${t('sys.operatorLog.name')}`,
        api: getOperateLogList,
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        showIndexColumn: false,
        defSort: {
          field: 'createTime',
          order: 'ascend',
        },
      });

      function handleSuccess() {
        reload();
      }

      return {
        registerTable,
        registerDrawer,
        handleSuccess,
      };
    },
  });
</script>
