<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <ApiButton type="primary" :api="handleRedo" v-auth="'MesLog_redo'"> 重新插入 </ApiButton>
      </template>
    </BasicTable>
    <MesLogtDrawer @register="registerDrawer" />
  </div>
</template>
<script lang="tsx" setup>
  import { TableAction, useTable, BasicTable } from '@/components/Table';
  import { getMesLogs } from '@/api/system/logs';
  import { getColumns, getFormConfig } from './data';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';
  import { useDrawer } from '@/components/Drawer';
  import { postMesAddBox, postMesAddPackage } from '@/api/others/mes';
  import { message } from 'ant-design-vue';
  import { ApiButton } from '@/components/Button';

  defineOptions({ name: 'MesLog' });

  const MesLogtDrawer = createAsyncComponent(() => import('./MesLogtDrawer.vue'));

  const [registerDrawer, { openDrawer }] = useDrawer();

  const [registerTable, { getSelectRows }] = useTable({
    api: getMesLogs,
    columns: getColumns(),
    rowKey: 'id',
    useSearchForm: true,
    formConfig: getFormConfig(),
    showTableSetting: true,
    loading: true,
    showIndexColumn: false,
    defSort: {
      columnKey: 'createdTime',
      order: 'descend',
    },
    rowSelection: {
      type: 'checkbox',
    },
    actionColumn: {
      width: 80,
      title: '操作',
      dataIndex: 'action',
      auth: ['MesLog_info'],
      customRender: ({ record }) => {
        return createActions(record);
      },
    },
  });

  const createActions = (record: any) => {
    return (
      <TableAction
        stopButtonPropagation
        actions={[
          {
            icon: 'ant-design:info-circle-outlined',
            tooltip: '详情',
            auth: 'MesLog_info',
            onClick: () => {
              openDrawer(true, record.id);
            },
          },
        ]}
      />
    );
  };

  const handleRedo = async () => {
    const selectRows = getSelectRows();
    for (const item of selectRows) {
      if (item.portType === 'BOX') {
        postMesAddBox(item.content);
      } else if (item.portType === 'PACKAGE') {
        await postMesAddPackage(item.content);
      }
    }
    message.success('重新插入成功');
  };
</script>
