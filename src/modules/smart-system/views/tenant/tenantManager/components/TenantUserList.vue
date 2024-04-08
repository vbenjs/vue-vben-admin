<template>
  <div class="full-height" :class="prefixCls">
    <SmartTable @register="register" :size="tableSizeConfig" />
    <TenantAddUserModal @register="registerAddUserModal" @after-bind="query" />
  </div>
</template>

<script setup lang="ts">
  import { computed, unref, watch } from 'vue';
  import { propTypes } from '@/utils/propTypes';
  import { SmartTable, useSmartTable } from '@/components/SmartTable';
  import { useSizeSetting } from '@/hooks/setting/UseSizeSetting';
  import { useModal } from '@/components/Modal';

  import {
    getTabUserListColumns,
    getTabUserListSearchSchemas,
    Permission,
  } from '../SysTenantListView.config';
  import { listTenantUserApi, removeBindUserApi } from '../SysTenantListView.api';
  import { useDesign } from '@/hooks/web/useDesign';
  import { useI18n } from '@/hooks/web/useI18n';
  import TenantAddUserModal from './TenantAddUserModal.vue';
  import { hasPermission } from '@/utils/auth';

  const props = defineProps({
    tenantId: propTypes.number,
  });
  watch(
    () => props.tenantId,
    () => query(),
  );
  const computedChoseTenant = computed(() => props.tenantId !== undefined);

  const { tableSizeConfig } = useSizeSetting();
  const { prefixCls } = useDesign('system-tenant-manager-userTab');
  const { t } = useI18n();

  const [registerAddUserModal, { openModal: openAddUserModal }] = useModal();

  const [register, { query }] = useSmartTable({
    id: 'system-tenant-manager-userList',
    columns: getTabUserListColumns(),
    border: true,
    height: 'auto',
    customConfig: { storage: true },
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
      compact: true,
      schemas: getTabUserListSearchSchemas(t),
      searchWithSymbol: false,
      colon: true,
      actionColOptions: {
        span: undefined,
      },
      layout: 'inline',
    },
    proxyConfig: {
      ajax: {
        async query({ ajaxParameter }) {
          const tenantId = props.tenantId;
          if (!tenantId) {
            return {
              rows: [],
              total: 0,
            };
          }
          return listTenantUserApi({
            ...ajaxParameter,
            tenantId,
          });
        },
        delete({ body: { removeRecords } }) {
          const userIdList = removeRecords.map((item) => item.userId);
          return removeBindUserApi({
            userIdList,
            tenantId: props.tenantId,
          });
        },
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
              onClick: () => openAddUserModal(true, { tenantId: props.tenantId }),
              disabled: !unref(computedChoseTenant) || !hasPermission(Permission.bindUser),
            };
          }),
        },
        {
          code: 'delete',
          props: computed(() => {
            return {
              disabled: !unref(computedChoseTenant) || !hasPermission(Permission.bindUser),
            };
          }),
        },
      ],
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-system-tenant-manager-userTab';
  .@{prefix-cls} {
    .smart-search-container {
      margin-bottom: 0;
      padding: 5px 10px 0;
    }
  }
</style>
