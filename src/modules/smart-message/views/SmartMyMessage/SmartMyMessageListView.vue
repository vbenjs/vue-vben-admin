<template>
  <div class="full-height page-container">
    <SmartTable @register="registerTable" :size="getTableSize">
      <template #table-operation="{ row }">
        <SmartVxeTableAction :actions="getActions(row)" />
      </template>
    </SmartTable>
    <SystemMessageShowModal @register="registerShowMessage" />
  </div>
</template>

<script setup lang="ts">
  import {
    ActionItem,
    SmartTable,
    SmartVxeTableAction,
    useSmartTable,
  } from '@/components/SmartTable';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useSizeSetting } from '@/hooks/setting/UseSizeSetting';

  import { getTableColumns, getSearchFormSchemas } from './SmartMyMessageListView.config';
  import { pageCurrentUserMessageApi, markAsReadApi } from './SmartMyMessageListView.api';
  import { createConfirm, successMessage, warnMessage } from '@/utils/message/SystemNotice';

  import SystemMessageShowModal from '../../components/SystemMessageShowModal.vue';
  import { useModal } from '@/components/Modal';

  const { t } = useI18n();
  const { getTableSize } = useSizeSetting();

  const [registerShowMessage, { openModal: openShowModal }] = useModal();

  const getActions = (row: Recordable): ActionItem[] => {
    return [
      {
        label: t('common.button.look'),
        onClick: () => openShowModal(true, { id: row.messageId }),
      },
    ];
  };

  /**
   * 标记已读
   */
  const handleMarkRead = () => {
    const selectRows = getCheckboxRecords(false);
    const parameter: any = {};
    if (selectRows.length === 0) {
      parameter.markAll = true;
    } else {
      const noReadList = selectRows.filter((item) => item.readYn === false);
      if (noReadList.length === 0) {
        warnMessage({
          message: t('smart.message.smartMyMessage.message.noRead'),
        });
        return false;
      }
      parameter.markAll = false;
      parameter.messageIdList = noReadList.map((item) => item.id);
    }
    createConfirm({
      iconType: 'warning',
      content: t('smart.message.smartMyMessage.message.confirmMarkRead'),
      onOk: async () => {
        await markAsReadApi(parameter);
        successMessage(t('smart.message.smartMyMessage.message.markReadSuccess'));
        query();
      },
    });
  };

  const [registerTable, { getCheckboxRecords, query }] = useSmartTable({
    id: 'smart-message-smart-my-message',
    columns: getTableColumns(t),
    border: true,
    height: 'auto',
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
    toolbarConfig: {
      zoom: true,
      column: {
        columnOrder: true,
      },
      refresh: true,
      buttons: [
        {
          name: t('smart.message.smartMyMessage.button.markRead'),
          customRender: 'ant',
          props: {
            preIcon: 'ant-design:highlight-outlined',
            type: 'primary',
            onClick: handleMarkRead,
          },
        },
      ],
    },
    proxyConfig: {
      ajax: {
        query: ({ ajaxParameter }) => {
          return pageCurrentUserMessageApi(ajaxParameter);
        },
      },
    },
  });
</script>

<style scoped lang="less"></style>
