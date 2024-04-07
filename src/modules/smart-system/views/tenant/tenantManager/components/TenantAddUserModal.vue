<template>
  <BasicModal
    @register="registerModal"
    :wrapClassName="prefixCls"
    :title="t('system.views.tenant.manager.title.tabUser')"
    :width="1000"
    :min-height="600"
    @ok="handleOk"
  >
    <SmartTable @register="registerTable" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { ref, unref } from 'vue';
  import { useDesign } from '@/hooks/web/useDesign';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { useI18n } from '@/hooks/web/useI18n';
  import { SmartTable, useSmartTable } from '@/components/SmartTable';
  import { uniqBy } from 'lodash-es';
  import {
    getTabUserListSearchSchemas,
    getBindUserModalListColumns,
  } from '../SysTenantListView.config';
  import { listNoBindUserApi, bindTenantUserApi } from '../SysTenantListView.api';
  import { successMessage, warnMessage } from '@/utils/message/SystemNotice';

  const emit = defineEmits(['register', 'afterBind']);

  const { prefixCls } = useDesign('system-tenant-manager-addUserModal');
  const { t } = useI18n();

  const tenantIdRef = ref<null | number>(null);
  const [registerModal, { changeOkLoading, closeModal }] = useModalInner(({ tenantId }) => {
    tenantIdRef.value = tenantId;
    query();
    getTableInstance().clearCheckboxRow();
  });

  /**
   * 保存操作
   */
  const handleOk = async () => {
    const tableInstance = getTableInstance();
    const selectRows = [
      ...(tableInstance.getCheckboxRecords() || []),
      ...(tableInstance.getCheckboxReserveRecords() || []),
    ];
    const userIdList = uniqBy(selectRows, 'userId').map((row) => row.userId);
    if (userIdList.length === 0) {
      warnMessage(t('system.views.tenant.manager.message.selectUser'));
      return false;
    }
    try {
      changeOkLoading(true);
      await bindTenantUserApi({
        userIdList,
        tenantId: unref(tenantIdRef),
      });
      successMessage(t('system.views.tenant.manager.message.bindUserSuccess'));
      closeModal();
      emit('afterBind');
    } finally {
      changeOkLoading(false);
    }
  };

  const [registerTable, { query, getTableInstance }] = useSmartTable({
    id: 'system-tenant-manager-add-user',
    columns: getBindUserModalListColumns(),
    height: 'auto',
    border: true,
    sortConfig: {
      remote: true,
    },
    stripe: true,
    customConfig: { storage: true },
    showOverflow: 'tooltip',
    rowConfig: {
      isHover: true,
      isCurrent: true,
      keyField: 'userId',
    },
    checkboxConfig: {
      rowTrigger: 'multiple',
      highlight: true,
      reserve: true,
    },
    columnConfig: {
      resizable: true,
    },
    pagerConfig: true,
    useSearchForm: true,
    searchFormConfig: {
      compact: true,
      schemas: getTabUserListSearchSchemas(t),
      searchWithSymbol: true,
      colon: true,
      actionColOptions: {
        span: undefined,
      },
      layout: 'inline',
    },
    proxyConfig: {
      ajax: {
        query({ ajaxParameter }) {
          return listNoBindUserApi({
            ...ajaxParameter,
            tenantId: unref(tenantIdRef),
          });
        },
      },
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-system-tenant-manager-addUserModal';
  .@{prefix-cls} {
    .scrollbar__view {
      display: flex;

      & > div:first-child {
        width: 100%;
      }
    }
  }
</style>
