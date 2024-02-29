<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    :title="title"
    :width="980"
    destroyOnClose
  >
    <BasicTable @register="registerTable" class="!p-0" />
    <DetailDrawer @register="register" />
  </BasicDrawer>
</template>
<script lang="tsx" setup>
  import { BasicDrawer, useDrawer, useDrawerInner } from '@/components/Drawer';
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import { ref } from 'vue';
  import { getGatewayOriginData } from '@/api/gateway';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';
  import { getOriginDataColumns } from './OriginDataColumns';
  import { RangePicker } from '@/components/Business';
  import { useComponentRegister } from '@/components/Form';

  useComponentRegister('MyRangePicker', RangePicker);

  const DetailDrawer = createAsyncComponent(() => import('./DetailDrawer.vue'));

  const rowId = ref<number>();
  const title = ref('');
  const terminalType = ref('');

  const emit = defineEmits(['load', 'register']);
  const [register, { openDrawer }] = useDrawer();

  const [registerTable, { setColumns }] = useTable({
    api: getGatewayOriginData,
    beforeFetch: (params) => {
      params.id = rowId.value;
      params.createTime = params.createTime ?? '';
      return params;
    },
    rowKey: 'id',
    loading: true,
    showIndexColumn: false,
    useSearchForm: true,
    pagination: { hideOnSinglePage: true },
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
    actionColumn: {
      width: 60,
      title: '操作',
      dataIndex: 'action',
      customRender: ({ record }) => {
        return createActions(record);
      },
    },
  });

  const createActions = (record: Recordable) => {
    return (
      <TableAction
        stopButtonPropagation
        actions={[
          {
            icon: 'ant-design:eye-outlined',
            tooltip: '原始数据',
            onClick: async () => {
              openDrawer(true, {
                record: record,
                terminalType: terminalType.value,
              });
            },
          },
        ]}
      />
    );
  };

  const [registerDrawer, { setDrawerProps }] = useDrawerInner(async (data) => {
    setDrawerProps({ confirmLoading: false });
    rowId.value = data.id;
    title.value = data.title;
    terminalType.value = data.terminalType;
    setColumns(getOriginDataColumns(terminalType.value));
    emit('load');
  });
</script>
