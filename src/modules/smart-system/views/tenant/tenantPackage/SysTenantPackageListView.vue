<template>
  <div class="full-height page-container">
    <SmartLayoutSeparate draggable class="full-height" second-size="240px">
      <template #first>
        <SmartTable
          @register="registerTable"
          :size="getTableSize"
          @current-change="handleCurrentChange"
        />
      </template>
      <template #second>
        <TenantPackageSetFunction :tenant-package-id="currentPackage?.id" />
      </template>
    </SmartLayoutSeparate>
  </div>
</template>

<script lang="ts" setup>
  import { useI18n } from '@/hooks/web/useI18n';
  import { useSizeSetting } from '@/hooks/setting/UseSizeSetting';

  import { SmartTable, useSmartTable } from '@/components/SmartTable';
  import { SmartLayoutSeparate } from '@/components/SmartLayoutSeparate';

  import TenantPackageSetFunction from './components/TenantPackageSetFunction.vue';

  import {
    getTableColumns,
    getFormSchemas,
    getSearchFormSchemas,
    Permission,
  } from './SysTenantPackageListView.config';
  import {
    listApi,
    deleteApi,
    setUseYnApi,
    getByIdApi,
    batchSaveUpdateApi,
  } from './SysTenantPackageListView.api';
  import { ref } from 'vue';

  const { t } = useI18n();
  const { getTableSize } = useSizeSetting();

  const currentPackage = ref<Recordable | null>(null);
  const handleCurrentChange = ({ row }) => {
    currentPackage.value = row;
  };

  const [registerTable] = useSmartTable({
    columns: getTableColumns(),
    height: 'auto',
    border: true,
    sortConfig: {
      remote: true,
      defaultSort: {
        field: 'seq',
        order: 'asc',
      },
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
      layout: 'inline',
      actionColOptions: {
        span: undefined,
      },
      compact: true,
    },
    addEditConfig: {
      formConfig: {
        schemas: getFormSchemas(t),
        colon: true,
        baseColProps: { span: 24 },
        labelCol: { span: 5 },
        wrapperCol: { span: 18 },
      },
    },
    proxyConfig: {
      ajax: {
        query: (params) => {
          currentPackage.value = null;
          return listApi(params.ajaxParameter);
        },
        save: ({ body: { insertRecords, updateRecords } }) => {
          const dataList = [...insertRecords, ...updateRecords];
          dataList.forEach((item) => {
            const times = item.times as Array<Date> | undefined;
            if (times && times.length > 0) {
              item.effectTime = times[0];
              item.expireTime = times[1];
            }
          });
          return batchSaveUpdateApi(dataList);
        },
        delete: ({ body: { removeRecords } }) => deleteApi(removeRecords),
        getById: async (params) => {
          const data = await getByIdApi(params.id);
          if (data && data.effectTime && data.expireTime) {
            data.times = [data.effectTime, data.expireTime];
          }
          return data;
        },
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
          auth: Permission.setUseYn,
        },
        {
          code: 'useYnFalse',
          auth: Permission.setUseYn,
        },
      ],
    },
  });
</script>
