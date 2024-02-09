<template>
  <div class="full-height page-container">
    <SmartTable @register="registerTable" :size="getTableSize">
      <template #table-operation="{ row }">
        <SmartVxeTableAction
          :actions="getActions(row)"
          :drop-down-actions="getDropDownAction(row)"
        />
      </template>
      <template #addEdit-content="{ model }">
        <Tinymce v-model:value="model.content" />
      </template>
    </SmartTable>
    <SystemMessageShowModal @register="registerModal" />
  </div>
</template>

<script lang="ts" setup>
  import { useI18n } from '@/hooks/web/useI18n';
  import { useSizeSetting } from '@/hooks/setting/UseSizeSetting';
  import { useModal } from '@/components/Modal';
  import { Tinymce } from '@/components/Tinymce';

  import SystemMessageShowModal from '../../components/SystemMessageShowModal.vue';

  import {
    ActionItem,
    SmartTable,
    SmartVxeTableAction,
    useSmartTable,
  } from '@/components/SmartTable';

  import {
    getTableColumns,
    getFormSchemas,
    getSearchFormSchemas,
    Auth,
  } from './SmartMessageSystemListView.config';
  import {
    listApi,
    deleteApi,
    getByIdApi,
    batchSaveUpdateApi,
    publishApi,
    revokeApi,
  } from './SmartMessageSystemListView.api';
  import { createConfirm, successMessage } from '@/utils/message/SystemNotice';

  const { t } = useI18n();
  const { getTableSize } = useSizeSetting();
  const [registerModal, { openModal: openShowModal }] = useModal();

  const getActions = (row: Recordable): ActionItem[] => {
    const actions: ActionItem[] = [];
    if (row.sendStatus === 'NO_SEND') {
      actions.push({
        label: t('common.button.edit'),
        onClick: () => editByRowModal(row),
        auth: Auth.update,
      });
    }
    return actions;
  };

  const getDropDownAction = (row: Recordable): ActionItem[] => {
    const actions: ActionItem[] = [];
    const sendStatus = row.sendStatus;
    if (sendStatus !== 'SEND') {
      actions.push({
        label: t('common.button.delete'),
        onClick: () => deleteByRow(row),
        auth: Auth.delete,
      });
    }
    if (sendStatus === 'NO_SEND') {
      actions.push({
        label: t('common.button.publish'),
        onClick: () => handlePublish(row),
        auth: Auth.publish,
      });
    }
    if (sendStatus === 'SEND') {
      actions.push({
        label: t('common.button.revoke'),
        onClick: () => handleRevoke(row),
        auth: Auth.cancel,
      });
    }
    actions.push({
      label: t('common.button.look'),
      onClick: () => openShowModal(true, row),
    });
    return actions;
  };

  /**
   * 发布操作
   * @param row
   */
  const handlePublish = (row: any) => {
    createConfirm({
      iconType: 'warning',
      content: t('smart.message.systemMessage.message.confirmPublish'),
      onOk: async () => {
        await publishApi([row.id]);
        successMessage(t('smart.message.systemMessage.message.publishSuccess'));
        query();
      },
    });
  };

  const handleRevoke = (row: any) => {
    createConfirm({
      iconType: 'warning',
      content: t('smart.message.systemMessage.message.confirmRevoke'),
      onOk: async () => {
        await revokeApi([row.id]);
        successMessage(t('smart.message.systemMessage.message.revokeSuccess'));
        query();
      },
    });
  };

  const [registerTable, { editByRowModal, deleteByRow, query }] = useSmartTable({
    columns: getTableColumns(t),
    height: 'auto',
    border: true,
    sortConfig: {
      remote: true,
    },
    columnConfig: {
      resizable: true,
    },
    checkboxConfig: {
      highlight: true,
    },
    pagerConfig: true,
    showOverflow: 'tooltip',
    useSearchForm: true,
    searchFormConfig: {
      compact: true,
      schemas: getSearchFormSchemas(t),
      searchWithSymbol: true,
      colon: true,
      autoSubmitOnEnter: true,
      layout: 'inline',
      actionColOptions: {
        span: undefined,
      },
    },
    addEditConfig: {
      modalConfig: {
        defaultFullscreen: true,
      },
      formConfig: {
        schemas: getFormSchemas(t),
        colon: true,
        baseColProps: { span: 24 },
        labelCol: { span: 6 },
        wrapperCol: { span: 17 },
      },
    },
    proxyConfig: {
      ajax: {
        query: (params) => listApi(params.ajaxParameter),
        save: ({ body: { insertRecords, updateRecords } }) =>
          batchSaveUpdateApi([...insertRecords, ...updateRecords]),
        delete: ({ body: { removeRecords } }) => deleteApi(removeRecords),
        getById: (params) => getByIdApi(params.id),
      },
    },
    toolbarConfig: {
      zoom: true,
      refresh: true,
      column: {
        columnOrder: true,
      },
      buttons: [
        {
          code: 'ModalAdd',
        },
        {
          code: 'delete',
        },
      ],
    },
  });
</script>
