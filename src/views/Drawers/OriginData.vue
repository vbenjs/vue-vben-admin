<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    title="原始数据记录"
    :width="980"
    destroyOnClose
  >
    <BasicTable @register="registerTable" class="!p-0" />
  </BasicDrawer>
</template>
<script lang="tsx" setup>
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
  import { BasicTable, useTable } from '@/components/Table';
  import { getSensorOriginData } from '@/api/sensor';
  import { ref } from 'vue';
  import { getOriginDataColumns } from './OriginDataColumns';

  const rowId = ref<number>();
  const sensorType = ref('');

  const emit = defineEmits(['load', 'register']);

  const [registerTable, { setColumns }] = useTable({
    api: getSensorOriginData,
    beforeFetch: (params) => {
      params.id = rowId.value;
      params.createTime = params.createTime ?? '';
      return params;
    },
    rowKey: 'id',
    loading: true,
    showIndexColumn: false,
    pagination: { hideOnSinglePage: true },
    useSearchForm: true,
    formConfig: {
      autoSubmitOnEnter: true,
      schemas: [
        {
          label: '记录时间',
          field: `createTime`,
          component: 'MyRangePicker',
          componentProps: {
            valueFormat: 'YYYY-MM-DD',
            style: `width:100%;`,
          },
          colProps: { span: 12 },
        },
      ],
    },
  });

  const [registerDrawer, { setDrawerProps }] = useDrawerInner(async (data) => {
    setDrawerProps({ confirmLoading: false });
    rowId.value = data.id;
    sensorType.value = data.sensorType;
    setColumns(getOriginDataColumns(sensorType.value));
    emit('load');
  });
</script>
