<template>
  <div class="full-height page-container">
    <SmartTable @register="registerTable" :size="getTableSize">
      <template #table-operation="{ row }">
        <SmartVxeTableAction :actions="getActions(row)" />
      </template>
    </SmartTable>

    <SendTestModal @register="registerTestSendModal" />
  </div>
</template>

<script lang="ts" setup>
  import { useI18n } from '@/hooks/web/useI18n';
  import { useSizeSetting } from '@/hooks/setting/UseSizeSetting';
  import { replace } from 'lodash-es';

  import { createConfirm, successMessage } from '@/utils/message/SystemNotice';
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
  } from './SmartSmsChannelManagerListView.config';
  import {
    listApi,
    deleteApi,
    getByIdApi,
    batchSaveUpdateApi,
    setDefaultApi,
  } from './SmartSmsChannelManagerListView.api';

  import SendTestModal from './components/SendTestModal.vue';
  import { useModal } from '@/components/Modal';

  const { t } = useI18n();
  const { getTableSize } = useSizeSetting();

  const [registerTestSendModal, { openModal }] = useModal();

  const getActions = (row: Recordable): ActionItem[] => {
    return [
      {
        label: t('common.button.edit'),
        onClick: () => editByRowModal(row),
        auth: 'smart:sms:update',
      },
      {
        label: t('smart.sms.channel.button.setDefault'),
        auth: 'smart:sms:update',
        disabled: row.isDefault === true,
        onClick: () => {
          createConfirm({
            iconType: 'warning',
            content: t('smart.sms.channel.message.setDefault'),
            onOk: async () => {
              await setDefaultApi(row.id);
              successMessage(t('smart.sms.channel.message.setDefaultSuccess'));
              await query();
            },
          });
        },
      },
      {
        label: t('smart.sms.channel.button.sendTest'),
        onClick: () => {
          openModal(true, { channelId: row.id });
        },
      },
    ];
  };

  const [registerTable, { editByRowModal, query }] = useSmartTable({
    id: 'smart-sms-smsChannel',
    customConfig: { storage: true },
    columns: getTableColumns(),
    height: 'auto',
    showOverflow: 'tooltip',
    pagerConfig: true,
    border: true,
    useSearchForm: true,
    sortConfig: {
      remote: true,
    },
    columnConfig: { resizable: true },
    searchFormConfig: {
      schemas: getSearchFormSchemas(t),
      searchWithSymbol: true,
      colon: true,
      layout: 'inline',
      actionColOptions: {
        span: undefined,
      },
      compact: true,
    },
    addEditConfig: {
      formConfig: {
        colon: true,
        schemas: getFormSchemas(t),
        baseColProps: { span: 24 },
        labelCol: { span: 6 },
        wrapperCol: { span: 17 },
      },
    },
    proxyConfig: {
      ajax: {
        query: (params) => listApi(params.ajaxParameter),
        save: ({ body: { insertRecords, updateRecords } }) => {
          const saveDataList = [...insertRecords, ...updateRecords];
          const formatDataList = saveDataList.map((item) => {
            const result: Record<string, any> = {};
            const channelProperties: Recordable = {};
            const propertiesKeyPrefix = `channelProperties.${item.channelType}.`;
            Object.keys(item).forEach((key) => {
              if (!key.startsWith(propertiesKeyPrefix)) {
                result[key] = item[key];
              } else if (key.startsWith(propertiesKeyPrefix)) {
                channelProperties[replace(key, propertiesKeyPrefix, '')] = item[key];
              }
            });
            result.channelProperties = JSON.stringify(channelProperties);
            return result;
          });
          return batchSaveUpdateApi(formatDataList);
        },
        delete: ({ body: { removeRecords } }) => deleteApi(removeRecords),
        getById: async (params) => {
          const result = await getByIdApi(params.id);
          if (result.channelProperties) {
            const channelProperties = JSON.parse(result.channelProperties);
            const channelType = result.channelType;
            const formatData: Recordable = {};
            Object.keys(channelProperties).forEach((item) => {
              formatData[`channelProperties.${channelType}.${item}`] = channelProperties[item];
            });
            console.log(formatData);
            return {
              ...result,
              ...formatData,
            };
          }
          return result;
        },
      },
    },
    toolbarConfig: {
      zoom: true,
      refresh: true,
      column: { columnOrder: true },
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
