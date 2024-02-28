<template>
  <div class="full-height page-container">
    <SmartTable @register="registerTable" :size="getTableSize">
      <template #table-operation="{ row }">
        <SmartVxeTableAction
          :actions="getActions(row)"
          :drop-down-actions="getDropDownActions(row)"
        />
      </template>
      <template #table-storageType="{ row }">
        <span>{{ getDictItemMap[row.storageType] }}</span>
      </template>
    </SmartTable>
  </div>
</template>

<script lang="ts" setup>
  import { useI18n } from '@/hooks/web/useI18n';
  import { useSizeSetting } from '@/hooks/setting/UseSizeSetting';
  import { replace } from 'lodash-es';
  import { Modal } from 'ant-design-vue';
  import { hasPermission } from '@/utils/auth';

  import {
    ActionItem,
    SmartTable,
    SmartVxeTableAction,
    useSmartTable,
  } from '@/components/SmartTable';
  import { useLoadDictItem } from '@/modules/smart-system/hooks/SysDictHooks';

  import {
    getTableColumns,
    getFormSchemas,
    getSearchFormSchemas,
  } from './SmartFileStorageListView.config';
  import {
    listApi,
    deleteApi,
    getByIdApi,
    batchSaveUpdateApi,
    setDefaultApi,
  } from './SmartFileStorageListView.api';
  import { createVNode } from 'vue';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';

  const { t } = useI18n();
  const { getTableSize } = useSizeSetting();

  const storageConfigPrefix = 'storageConfig';
  const { getDictItemMap } = useLoadDictItem('FILE_STORAGE_TYPE');

  const getActions = (row: Recordable): ActionItem[] => {
    return [
      {
        label: t('common.button.edit'),
        auth: 'smart:fileStorage:update',
        onClick: () => editByRowModal(row),
      },
      {
        label: t('common.button.delete'),
        onClick: () => deleteByRow(row),
        auth: 'smart:fileStorage:delete',
        danger: true,
      },
    ];
  };

  const getDropDownActions = (row: Recordable): ActionItem[] => {
    return [
      {
        label: t('smart.file.storage.button.setDefault'),
        preIcon: 'ant-design:check-outlined',
        disabled: row.defaultStorage === true,
        auth: 'smart:fileStorage:setDefault',
        onClick: () => {
          Modal.confirm({
            title: t('common.notice.confirm'),
            icon: createVNode(ExclamationCircleOutlined),
            content: t('smart.file.storage.message.setDefault'),
            onOk: async () => {
              await setDefaultApi(row.id);
              query();
            },
          });
        },
      },
    ];
  };

  const [registerTable, { editByRowModal, deleteByRow, query }] = useSmartTable({
    columns: getTableColumns(),
    height: 'auto',
    pagerConfig: true,
    useSearchForm: true,
    stripe: true,
    rowConfig: {
      isHover: true,
      isCurrent: true,
    },
    searchFormConfig: {
      schemas: getSearchFormSchemas(t),
      searchWithSymbol: true,
      colon: true,
      compact: true,
      layout: 'inline',
      actionColOptions: {
        span: undefined,
      },
    },
    addEditConfig: {
      modalConfig: {
        // width: '800px',
        height: 800,
      },
      formConfig: {
        colon: true,
        schemas: getFormSchemas(t),
        baseColProps: { span: 24 },
        labelCol: { style: { width: '120px' } },
        wrapperCol: { span: 17 },
      },
    },
    sortConfig: {
      remote: true,
      defaultSort: {
        field: 'seq',
        order: 'asc',
      },
    },
    columnConfig: {
      resizable: true,
    },
    border: true,
    proxyConfig: {
      ajax: {
        query: ({ ajaxParameter }) => {
          const params = {
            sortName: 'seq',
            ...ajaxParameter,
          };
          return listApi(params);
        },
        save: ({ body: { insertRecords, updateRecords } }) => {
          const saveDatList = [...insertRecords, ...updateRecords];
          const formatDataList = saveDatList.map((item) => {
            const result: any = {};
            const storageConfig: Recordable = {};
            const configKeyPrefix = storageConfigPrefix + '.' + item.storageType + '.';
            Object.keys(item).forEach((key) => {
              if (!key.startsWith(storageConfigPrefix)) {
                result[key] = item[key];
              } else if (key.startsWith(configKeyPrefix)) {
                storageConfig[replace(key, configKeyPrefix, '')] = item[key];
              }
            });
            result.storageConfig = JSON.stringify(storageConfig);
            return result;
          });
          return batchSaveUpdateApi(formatDataList);
        },
        delete: ({ body: { removeRecords } }) => deleteApi(removeRecords),
        getById: async (params) => {
          const result = await getByIdApi(params);
          if (result.storageConfig) {
            const storageConfig = JSON.parse(result.storageConfig);
            const storageType = result.storageType;
            const formatData: Recordable = {};
            Object.keys(storageConfig).forEach((item) => {
              formatData[`${storageConfigPrefix}.${storageType}.${item}`] = storageConfig[item];
            });
            return {
              ...result,
              ...formatData,
            };
          }
          return result;
        },
      },
    },
    authConfig: {
      authHandler: hasPermission,
      toolbar: {
        ModalAdd: 'smart:fileStorage:save',
        delete: 'smart:fileStorage:delete',
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
