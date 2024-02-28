<template>
  <div class="full-height page-container">
    <SmartTable @register="registerTable" :size="getTableSize">
      <template #table-operation="{ row }">
        <SmartVxeTableAction :actions="getActions(row)" />
      </template>
      <template #form-upload="{ model }">
        <Upload v-model:fileList="model.fileList" :max-count="1" :beforeUpload="() => false">
          <a-button>Upload</a-button>
        </Upload>
      </template>
    </SmartTable>
  </div>
</template>

<script lang="ts" setup>
  import { useI18n } from '@/hooks/web/useI18n';
  import { useSizeSetting } from '@/hooks/setting/UseSizeSetting';
  import { Upload } from 'ant-design-vue';

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
  } from './SmartFileListView.config';
  import {
    listApi,
    deleteApi,
    getByIdApi,
    uploadFileApi,
    downloadApi,
  } from './SmartFileListView.api';

  const { t } = useI18n();
  const { getTableSize } = useSizeSetting();

  const getActions = (row: Recordable): ActionItem[] => {
    return [
      {
        label: t('common.button.delete'),
        onClick: () => deleteByRow(row),
        danger: true,
      },
      {
        label: t('common.button.download'),
        preIcon: 'ant-design:download-outlined',
        auth: 'smart:file:download',
        onClick: async () => {
          await downloadApi(row.fileId);
        },
      },
    ];
  };

  const [registerTable, { deleteByRow }] = useSmartTable({
    id: 'smart-file-fileList',
    columns: getTableColumns(),
    height: 'auto',
    border: true,
    pagerConfig: true,
    useSearchForm: true,
    showOverflow: 'tooltip',
    rowConfig: {
      keyField: 'fileId',
      isCurrent: true,
    },
    customConfig: {
      storage: true,
    },
    columnConfig: {
      resizable: true,
    },
    sortConfig: { remote: true, defaultSort: { field: 'createTime', order: 'desc' } },
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
        schemas: getFormSchemas(t),
        baseColProps: { span: 24 },
        labelCol: { span: 6 },
        wrapperCol: { span: 17 },
      },
    },
    proxyConfig: {
      ajax: {
        query: (params) => listApi(params.ajaxParameter),
        save: ({ body: { insertRecords } }) => {
          const dataList = [...insertRecords];
          if (dataList.length === 0) {
            return Promise.resolve();
          }
          const { fileStorageId, fileName, type, seq, fileList } = dataList[0];
          return uploadFileApi(
            {
              fileStorageId,
              fileName,
              type,
              seq,
            },
            fileList[0].originFileObj,
          );
        },
        delete: ({ body: { removeRecords } }) => deleteApi(removeRecords),
        getById: (params) => getByIdApi(params.id),
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
