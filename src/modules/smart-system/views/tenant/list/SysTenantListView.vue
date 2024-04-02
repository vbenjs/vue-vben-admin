<template>
  <div class="full-height page-container">
    <SmartTable @register="registerTable" :size="getTableSize">
      <template #table-isolationStrategy="{ row }">
        <span>{{ computedIsolationStrategyMap[row.isolationStrategy] }}</span>
      </template>
      <template #table-type="{ row }">
        <span>{{ computedTenantTypeDictMap[row.type] }}</span>
      </template>
    </SmartTable>
  </div>
</template>

<script lang="ts" setup>
  import { mapValues, keyBy } from 'lodash-es';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useSizeSetting } from '@/hooks/setting/UseSizeSetting';

  import { SmartTable, useSmartTable } from '@/components/SmartTable';

  import {
    getFormSchemas,
    getSearchFormSchemas,
    getTableColumns,
    Permission,
    SYSTEM_TENANT_TYPE_DICT,
  } from './SysTenantListView.config';
  import {
    batchSaveUpdateApi,
    deleteApi,
    getByIdApi,
    listApi,
    setUseYnApi,
    listIsolationStrategyApi,
  } from './SysTenantListView.api';
  import { useInjectPageDict } from '@/components/SmartPageProvider';
  import { computed, onMounted, ref, unref } from 'vue';

  const { t } = useI18n();
  const { getTableSize } = useSizeSetting();

  const isolationStrategyListRef = ref<any[]>([]);
  const computedIsolationStrategyMap = computed(() => {
    return mapValues(keyBy(unref(isolationStrategyListRef), 'value'), 'label');
  });
  const initIsolationStrategy = async () => {
    isolationStrategyListRef.value = await listIsolationStrategyApi();
  };

  const { pageDictMap, pageDictRegister } = useInjectPageDict();
  const computedTenantTypeDictMap = computed(() => {
    return unref(pageDictMap || {})[SYSTEM_TENANT_TYPE_DICT] || {};
  });
  onMounted(() => pageDictRegister(SYSTEM_TENANT_TYPE_DICT));

  const [registerTable] = useSmartTable({
    columns: getTableColumns(),
    height: 'auto',
    border: true,
    sortConfig: {
      remote: true,
    },
    showOverflow: 'tooltip',
    rowConfig: {
      isHover: true,
      isCurrent: true,
    },
    columnConfig: {
      resizable: true,
    },
    pagerConfig: true,
    useSearchForm: true,
    searchFormConfig: {
      schemas: getSearchFormSchemas(t),
      searchWithSymbol: true,
      colon: true,
      actionColOptions: {
        span: 5,
      },
      compact: true,
      baseColProps: { span: 6 },
      labelCol: { style: { width: '90px' } },
      wrapperCol: { span: 17 },
    },
    addEditConfig: {
      modalConfig: {
        width: 900,
      },
      formConfig: {
        schemas: getFormSchemas(t, isolationStrategyListRef),
        colon: true,
        baseColProps: { span: 12 },
        labelCol: { style: { width: '90px' } },
      },
    },
    proxyConfig: {
      ajax: {
        query: async (params) => {
          if (unref(isolationStrategyListRef).length === 0) {
            await initIsolationStrategy();
          }
          return listApi(params.ajaxParameter);
        },
        save: ({ body: { insertRecords, updateRecords } }) =>
          batchSaveUpdateApi([...insertRecords, ...updateRecords]),
        delete: ({ body: { removeRecords } }) => deleteApi(removeRecords),
        getById: (params) => getByIdApi(params.id),
        useYn: setUseYnApi,
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
          auth: Permission.save,
        },
        {
          code: 'ModalEdit',
          auth: Permission.update,
        },
        {
          code: 'delete',
          auth: Permission.delete,
        },
        {
          code: 'useYnTrue',
          auth: Permission.useYn,
        },
        {
          code: 'useYnFalse',
          auth: Permission.useYn,
        },
      ],
    },
  });
</script>
