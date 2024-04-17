<template>
  <div class="full-height" style="margin-right: 5px">
    <SmartTable @register="registerTable" @current-change="handleCurrentChange" />
  </div>
</template>

<script lang="ts" setup>
  import { useI18n } from '@/hooks/web/useI18n';
  import { useSmartTable, SmartTable } from '@/components/SmartTable';

  import {
    getDataDictGroupColumns,
    getDataDictGroupSearchSchemas,
    getDataDictGroupAddEditSchemas,
  } from './DataDictListView.config';
  import {
    listDictApi,
    getByIdDictApi,
    deleteDictApi,
    saveUpdateDictApi,
  } from './DataDictListView.api';
  import { storeToRefs } from 'pinia';
  import { useUserStore } from '@/store/modules/user';

  const emit = defineEmits(['code-change']);

  const { t } = useI18n();

  const { getIsPlatformTenant } = storeToRefs(useUserStore());

  const handleCurrentChange = ({ row }: any) => {
    emit('code-change', row.id);
  };

  const [registerTable] = useSmartTable({
    id: 'system-dataDict',
    columns: getDataDictGroupColumns(),
    border: true,
    height: 'auto',
    stripe: true,
    customConfig: { storage: true },
    showOverflow: 'tooltip',
    rowConfig: {
      isHover: true,
      isCurrent: true,
    },
    pagerConfig: true,
    useSearchForm: true,
    searchFormConfig: {
      colon: true,
      compact: true,
      searchWithSymbol: true,
      schemas: getDataDictGroupSearchSchemas(t),
      layout: 'inline',
      actionColOptions: {
        span: undefined,
      },
      // baseColProps: {
      //   span: 8,
      // },
    },
    addEditConfig: {
      formConfig: {
        schemas: getDataDictGroupAddEditSchemas(t, getIsPlatformTenant),
        baseColProps: {
          span: 24,
        },
        labelCol: {
          span: 5,
        },
        wrapperCol: {
          span: 18,
        },
      },
    },
    proxyConfig: {
      ajax: {
        query: ({ ajaxParameter }) => {
          const parameter = {
            sortName: 'seq',
            ...ajaxParameter,
          };
          return listDictApi(parameter);
        },
        save: ({ body: { insertRecords, updateRecords } }) =>
          saveUpdateDictApi([...insertRecords, ...updateRecords][0]),
        delete: ({ body: { removeRecords } }) => deleteDictApi(removeRecords),
        getById: (params) => getByIdDictApi(params.id),
      },
    },
    columnConfig: {
      resizable: true,
    },
    toolbarConfig: {
      refresh: true,
      zoom: true,
      sizeSetting: true,
      column: { columnOrder: true },
      buttons: [{ code: 'ModalAdd' }, { code: 'ModalEdit' }, { code: 'delete' }],
    },
  });
</script>

<style scoped></style>
