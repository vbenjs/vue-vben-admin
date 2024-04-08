<template>
  <div class="full-height">
    <SmartTable @register="registerTable" :size="getTableSize" />
  </div>
</template>

<script setup lang="ts">
  import { useSizeSetting } from '@/hooks/setting/UseSizeSetting';
  import { useI18n } from '@/hooks/web/useI18n';
  import { SmartTable, useSmartTable } from '@/components/SmartTable';

  import {
    getSubscribeTableColumns,
    Permission,
    getSubscribeFormSchemas,
  } from '../SysTenantListView.config';
  import {
    listSubscribeApi,
    setSubscribeUseYnApi,
    getSubscribeByIdApi,
    batchSaveUpdateSubscribeApi,
  } from '../SysTenantListView.api';
  import { propTypes } from '@/utils/propTypes';
  import { computed, toRefs, unref, watch } from 'vue';
  import { hasPermission } from '@/utils/auth';

  const props = defineProps({
    tenantId: propTypes.number,
  });
  const { tenantId: tenantIdRef } = toRefs(props);
  watch(tenantIdRef, () => query());
  const computedChoseTenant = computed(() => props.tenantId !== undefined);

  const { t } = useI18n();
  const { getTableSize } = useSizeSetting();

  const [registerTable, { query }] = useSmartTable({
    id: 'system-tenant-manager-subscribeList',
    columns: getSubscribeTableColumns(),
    height: 'auto',
    customConfig: { storage: true },
    stripe: true,
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
    pagerConfig: false,
    addEditConfig: {
      formConfig: {
        schemas: getSubscribeFormSchemas(t, tenantIdRef),
        colon: true,
        baseColProps: { span: 24 },
        labelCol: { span: 6 },
        wrapperCol: { span: 17 },
      },
    },
    proxyConfig: {
      ajax: {
        query: async (params) => {
          const tenantId = props.tenantId;
          if (!tenantId) {
            return [];
          }
          return listSubscribeApi({
            ...params.ajaxParameter,
            tenantId,
          });
        },
        save: ({ body: { insertRecords, updateRecords } }) => {
          const dataList = [...insertRecords, ...updateRecords];
          dataList.forEach((item) => {
            const times = item.times as Array<Date> | undefined;
            if (times && times.length > 0) {
              item.effectTime = times[0];
              item.expireTime = times[1];
            }
            item.tenantId = props.tenantId;
          });
          return batchSaveUpdateSubscribeApi(dataList);
        },
        getById: async (params) => {
          const data = await getSubscribeByIdApi(params.id);
          if (data && data.effectTime && data.expireTime) {
            data.times = [data.effectTime, data.expireTime];
          }
          return data;
        },
        useYn: setSubscribeUseYnApi,
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
          props: computed(() => {
            return {
              disabled:
                !unref(computedChoseTenant) || !hasPermission(Permission.subscribeAddUpdate),
            };
          }),
        },
        {
          code: 'ModalEdit',
          auth: Permission.subscribeAddUpdate,
        },
        {
          code: 'delete',
          auth: Permission.subscribeDelete,
        },
        {
          code: 'useYnTrue',
          auth: Permission.subscribeSetUseYn,
        },
        {
          code: 'useYnFalse',
          auth: Permission.subscribeSetUseYn,
        },
      ],
    },
  });
</script>

<style scoped lang="less"></style>
