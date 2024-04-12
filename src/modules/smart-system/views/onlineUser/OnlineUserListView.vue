<template>
  <div class="full-height page-container">
    <SmartTable :size="getTableSize" @register="registerTable">
      <template #table-expand="{ row }">
        <SmartTable
          :size="getTableSize"
          class="expand-wrapper"
          :data="row.userLoginDataList"
          @register="registerExpandTable"
        >
          <template #expand-table-operation="data">
            <SmartVxeTableAction :actions="getTableActions(data.row, true)" />
          </template>
        </SmartTable>
      </template>
      <template #table-operation="{ row }">
        <SmartVxeTableAction :actions="getTableActions(row, false)" />
      </template>
      <template #search-tenantId="{ model, field }">
        <SysTenantSelect style="width: 100px" allowClear v-model:value="model[field]" />
      </template>
    </SmartTable>
  </div>
</template>

<script lang="ts" setup>
  import type { ActionItem } from '@/components/SmartTable';

  import { useI18n } from '@/hooks/web/useI18n';
  import { useSmartTable, SmartTable, SmartVxeTableAction } from '@/components/SmartTable';
  import { useSizeSetting } from '@/hooks/setting/UseSizeSetting';
  import { message, Modal } from 'ant-design-vue';
  import { createVNode } from 'vue';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';

  import {
    getTableColumns,
    getTableExpandColumns,
    getSearchFormSchemas,
  } from './OnlineUserListView.config';
  import { listOnlineUserApi, offlineApi } from './OnlineUserListView.api';
  import { storeToRefs } from 'pinia';
  import { useUserStore } from '@/store/modules/user';
  import { SysTenantSelect } from '@/modules/smart-system/components';

  const { t } = useI18n();
  const { getTableSize } = useSizeSetting();
  const { getIsPlatformTenant } = storeToRefs(useUserStore());

  const getTableActions = (row, isExpand: boolean): ActionItem[] => {
    return [
      {
        label: t('system.views.onlineUser.button.offline'),
        auth: 'sys:auth:offline',
        danger: true,
        onClick: () => {
          handleOffline(isExpand ? null : row.username, isExpand ? row.token : null);
        },
      },
    ];
  };

  /**
   * 执行登出操作
   * @param username 用户名
   * @param token token
   */
  const handleOffline = (username?: string, token?: string) => {
    Modal.confirm({
      title: t('common.notice.confirm'),
      icon: createVNode(ExclamationCircleOutlined),
      content: t('system.views.onlineUser.message.offlineConfirm'),
      onOk: async () => {
        await offlineApi(username, token);
        message.success(t('system.views.onlineUser.message.offlineSuccess'));
        query();
      },
    });
  };

  const [registerTable, { query }] = useSmartTable({
    border: true,
    height: 'auto',
    columns: getTableColumns(),
    useSearchForm: true,
    rowConfig: {
      isHover: true,
    },
    searchFormConfig: {
      layout: 'inline',
      schemas: getSearchFormSchemas(t, getIsPlatformTenant),
      colon: true,
      actionColOptions: {
        span: undefined,
      },
      compact: true,
    },
    proxyConfig: {
      ajax: {
        query: ({ ajaxParameter }) => listOnlineUserApi(ajaxParameter),
      },
    },
    columnConfig: {
      resizable: true,
    },
    toolbarConfig: {
      refresh: true,
    },
  });

  const [registerExpandTable] = useSmartTable({
    columns: getTableExpandColumns(),
    border: true,
    stripe: true,
    showOverflow: 'tooltip',
  });
</script>

<style scoped lang="less">
  .expand-wrapper {
    padding: 10px 0;
  }
</style>
