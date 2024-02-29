<template>
  <div>
    <BasicTable @register="registerTable" :showSorterTooltip="false">
      <template #toolbar>
        <a-button
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
          v-auth="'RemindMessage_add'"
        >
          新建
        </a-button>
      </template>
    </BasicTable>

    <MessageDrawer @register="registerModal" @success="handleSuccess" />
    <ContentDrawer @register="registerDrawer" />
    <SubscribeInfoDrawer @register="registerSubscribeInfoDrawer" />
  </div>
</template>
<script lang="tsx" setup name="SensorIndex">
  import { defineAsyncComponent } from 'vue';
  import { getFormConfig, getColumns } from './data';
  import { useDrawer } from '@/components/Drawer';
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import {
    deleteRemindMessage,
    getRemindMessage,
    getRemindMessageById,
  } from '@/api/remind/message';
  import { YN } from '@/enums/YN';
  import { RemindMessageResult } from '@/api/remind/model/message';

  const MessageDrawer = defineAsyncComponent(() => import('./MessageDrawer.vue'));
  const ContentDrawer = defineAsyncComponent(() => import('./ContentDrawer.vue'));
  const SubscribeInfoDrawer = defineAsyncComponent(() => import('./SubscribeInfoDrawer.vue'));

  // const [registerModal, { openModal }] = useModal();
  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerModal, { openDrawer: openModal }] = useDrawer();
  const [registerSubscribeInfoDrawer, { openDrawer: openSubscribeInfoDrawer }] = useDrawer();

  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    api: (where) => getRemindMessage(where, YN.N, true),
    columns: getColumns(),
    rowKey: 'id',
    useSearchForm: true,
    formConfig: getFormConfig(),
    showTableSetting: true,
    loading: true,
    showIndexColumn: false,
    defSort: {
      columnKey: 'sortNum',
      order: 'descend',
    },
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
      auth: ['RemindMessage_edit', 'RemindMessage_del'],
      customRender: ({ record }) => {
        return createActions(record as RemindMessageResult);
      },
    },
  });

  const createActions = (record: RemindMessageResult) => {
    return (
      <TableAction
        stopButtonPropagation
        actions={[
          {
            icon: 'clarity:note-edit-line',
            tooltip: '编辑',
            auth: 'RemindMessage_edit',
            onClick: async () => {
              openModal(true, {
                id: record.id,
                actionKey: 'edit',
              });
            },
          },
          {
            icon: 'fluent:note-pin-20-regular',
            tooltip: '修改内容',
            auth: 'RemindMessage_content',
            onClick: async () => {
              const data = await getRemindMessageById(record.id);
              openDrawer(true, {
                content: data.content ?? '',
                messageType: data.messageType,
                id: record.id,
              });
            },
          },
        ]}
        dropDownActions={[
          {
            icon: 'akar-icons:copy',
            label: '拷贝',
            auth: 'RemindMessage_copy',
            onClick: async () => {
              openModal(true, {
                id: record.id,
                actionKey: 'copy',
              });
            },
          },
          {
            icon: 'ph:rss-bold',
            label: '订阅列表',
            auth: 'RemindMessage_subscribe',
            onClick: async () => {
              openSubscribeInfoDrawer(true, {
                id: record.id,
              });
            },
            ifShow: record.messageType === 'WX',
          },
          {
            icon: 'ant-design:delete-outlined',
            label: '删除',
            color: 'error',
            auth: 'RemindMessage_del',
            popConfirm: {
              title: '是否确认删除？',
              placement: 'left',
              confirm: async () => {
                await deleteRemindMessage([record.id]);
                reload();
              },
            },
          },
        ]}
      />
    );
  };

  function handleSuccess({ action, values }) {
    if (action == 'edit') {
      updateTableDataRecord(values.id, values);
    } else {
      reload();
    }
  }

  const handleCreate = () => {
    openModal(true, {
      actionKey: 'create',
    });
  };
</script>
