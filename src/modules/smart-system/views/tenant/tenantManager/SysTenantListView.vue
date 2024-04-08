<template>
  <div class="full-height page-container" :class="prefixCls">
    <SmartLayoutSeparate layout="topBottom" first-size="45%" draggable class="full-height">
      <template #first>
        <SmartTable
          @register="registerTable"
          :size="getTableSize"
          @current-change="handleCurrentChange"
        >
          <template #table-isolationStrategy="{ row }">
            <span>{{ computedIsolationStrategyMap[row.isolationStrategy] }}</span>
          </template>
          <template #table-type="{ row }">
            <span>{{ computedTenantTypeDictMap[row.type] }}</span>
          </template>
        </SmartTable>
      </template>
      <template #second>
        <a-tabs>
          <a-tab-pane key="user" :tab="t('system.views.tenant.manager.title.tabUser')">
            <TenantUserList :tenant-id="currentTenantRef?.id" />
          </a-tab-pane>
          <a-tab-pane key="subscribe" :tab="t('system.views.tenant.manager.title.tabSubscribe')">
            <TenantSubscribeList :tenant-id="currentTenantRef?.id" />
          </a-tab-pane>
        </a-tabs>
      </template>
    </SmartLayoutSeparate>
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
  import { SmartLayoutSeparate } from '@/components/SmartLayoutSeparate';
  import { useDesign } from '@/hooks/web/useDesign';

  import TenantUserList from './components/TenantUserList.vue';
  import TenantSubscribeList from './components/TenantSubscribeList.vue';

  const { prefixCls } = useDesign('system-tenant-manager');

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

  const currentTenantRef = ref<Recordable | null>(null);
  const handleCurrentChange = ({ row }) => {
    currentTenantRef.value = row;
  };

  const [registerTable] = useSmartTable({
    id: 'system-tenant-manager',
    columns: getTableColumns(),
    height: 'auto',
    border: true,
    sortConfig: {
      remote: true,
    },
    customConfig: { storage: true },
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
        // {
        //   code: 'delete',
        //   auth: Permission.delete,
        // },
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

<style lang="less">
  @prefix-cls: ~'@{namespace}-system-tenant-manager';

  .@{prefix-cls} {
    .ant-tabs {
      height: 100%;
      background: white;
    }

    .ant-tabs-nav-wrap {
      margin-left: 10px;
    }

    .ant-tabs-content {
      height: 100%;
    }

    .ant-tabs-nav {
      margin-bottom: 5px;
    }
  }
</style>
