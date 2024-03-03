<template>
  <div class="full-height page-container">
    <SmartTable @register="registerTable" :size="getTableSize">
      <template #table-operation="{ row }">
        <SmartVxeTableAction :actions="getActions(row)" />
      </template>
      <template #addEdit-templateContent="{ model }">
        <Tinymce
          v-model:value="model.templateContent"
          :height="600"
          :imageAction="
            defHttp.getApiUrlByService(ApiServiceEnum.SMART_FILE) + '/smart/file/upload'
          "
        />
      </template>
    </SmartTable>
  </div>
</template>

<script lang="ts" setup>
  import { useI18n } from '@/hooks/web/useI18n';
  import { useSizeSetting } from '@/hooks/setting/UseSizeSetting';
  import { Tinymce } from '@/components/Tinymce';

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
  } from './SmartMessageTemplateListView.config';
  import {
    listApi,
    deleteApi,
    getByIdApi,
    batchSaveUpdateApi,
  } from './SmartMessageTemplateListView.api';
  import { ApiServiceEnum, defHttp } from '@/utils/http/axios';

  const { t } = useI18n();
  const { getTableSize } = useSizeSetting();

  const getActions = (row: Recordable): ActionItem[] => {
    return [
      {
        label: t('common.button.edit'),
        onClick: () => editByRowModal(row),
      },
    ];
  };

  const [registerTable, { editByRowModal }] = useSmartTable({
    columns: getTableColumns(),
    height: 'auto',
    border: true,
    sortConfig: {
      remote: true,
    },
    pagerConfig: true,
    columnConfig: {
      resizable: true,
    },
    stripe: true,
    rowConfig: {
      isHover: true,
      isCurrent: true,
    },
    showOverflow: 'tooltip',
    useSearchForm: true,
    searchFormConfig: {
      compact: true,
      schemas: getSearchFormSchemas(t),
      searchWithSymbol: true,
      colon: true,
      layout: 'inline',
      actionColOptions: {
        span: undefined,
      },
      labelCol: {
        span: 8,
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
        labelCol: { span: 3 },
        wrapperCol: { span: 20 },
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
      custom: true,
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
