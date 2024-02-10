<template>
  <div>
    <SmartTable
      @register="registerTable"
      v-bind="getTableProps"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
  import type { SmartTableProps } from '@/components/SmartTable';

  import { computed } from 'vue';

  import { SmartTable, useSmartTable } from '@/components/SmartTable';
  import { ApiServiceEnum, defHttp } from '@/utils/http/axios';

  const props = defineProps({
    tableProps: Object as PropType<SmartTableProps>,
  });

  const emit = defineEmits(['current-change']);

  const handleCurrentChange = ({ row }) => {
    emit('current-change', row);
  };

  const getTableProps = computed<SmartTableProps>(() => {
    return {
      rowConfig: {
        isHover: true,
        isCurrent: true,
      },
      columns: [
        {
          title: '{generator.views.template.title.templateGroup}',
          field: 'groupName',
        },
      ],
      height: 'auto',
      proxyConfig: {
        ajax: {
          query: async (params) => {
            const result = await defHttp.post({
              service: ApiServiceEnum.SMART_CODE,
              url: 'db/code/template/listGroup',
              data: {
                ...params.ajaxParameter,
                sortName: 'seq',
              },
            });
            return [{ groupName: 'ALL' }, ...result];
          },
        },
      },
      ...props.tableProps,
    };
  });

  const [registerTable] = useSmartTable();
</script>

<style scoped></style>
