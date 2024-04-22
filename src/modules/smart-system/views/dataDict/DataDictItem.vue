<template>
  <div class="full-height">
    <SmartTable @register="registerTable" />
  </div>
</template>

<script lang="ts" setup>
  import { propTypes } from '@/utils/propTypes';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useSmartTable, SmartTable } from '@/components/SmartTable';

  import { getDataDictItemColumns, getDataDictItemAddEditSchemas } from './DataDictListView.config';
  import {
    listDictItemApi,
    deleteDictItemApi,
    batchSaveUpdateDictItemApi,
    getByIdDictItemApi,
  } from './DataDictListView.api';
  import { watch } from 'vue';

  const props = defineProps({
    dictId: propTypes.number,
  });

  const { t } = useI18n();

  watch(
    () => props.dictId,
    (value) => {
      if (value) {
        query();
      }
    },
  );

  const [registerTable, { query }] = useSmartTable({
    columns: getDataDictItemColumns(),
    border: true,
    height: 'auto',
    stripe: true,
    rowConfig: {
      isHover: true,
    },
    pagerConfig: true,
    sortConfig: {
      remote: true,
      defaultSort: {
        field: 'seq',
        order: 'asc',
      },
    },
    addEditConfig: {
      formConfig: {
        schemas: getDataDictItemAddEditSchemas(t),
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
      autoLoad: false,
      ajax: {
        query: ({ ajaxParameter }) => {
          const parameter = {
            sortName: 'seq',
            ...ajaxParameter,
            parameter: {
              ...ajaxParameter?.parameter,
              'dictId@=': props.dictId,
            },
          };
          return listDictItemApi(parameter);
        },
        save: ({ body: { insertRecords, updateRecords } }) => {
          insertRecords.forEach((item) => (item.dictId = props.dictId));
          return batchSaveUpdateDictItemApi([...insertRecords, ...updateRecords]);
        },
        delete: ({ body: { removeRecords } }) => deleteDictItemApi(removeRecords),
        getById: (params) => getByIdDictItemApi(params),
      },
    },
    columnConfig: {
      resizable: true,
    },
    toolbarConfig: {
      refresh: true,
      zoom: true,
      custom: true,
      buttons: [{ code: 'ModalAdd' }, { code: 'ModalEdit' }, { code: 'delete' }],
    },
  });
</script>

<style scoped></style>
