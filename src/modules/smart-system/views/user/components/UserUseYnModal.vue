<template>
  <BasicModal @register="registerModal" :canFullscreen="false" :closable="false" @ok="handleOk">
    <SmartTable @register="registerTable" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { SmartTable, useSmartTable } from '@/components/SmartTable';

  import { listTenantApi, setUseYnApi } from '../UserListView.api';
  import { successMessage, warnMessage } from '@/utils/message/SystemNotice';
  import { useI18n } from '@/hooks/web/useI18n';

  const { t } = useI18n();

  let selectRows: Recordable[] = [];
  let useYnValue = null;

  const [registerModal, { changeOkLoading, closeModal }] = useModalInner(({ rows, useYn }) => {
    selectRows = rows || [];
    useYnValue = useYn;
    query();
  });

  const handleOk = async () => {
    const selectTenants = getCheckboxRecords();
    if (selectTenants.length === 0) {
      warnMessage(t('common.notice.select'));
      return false;
    }
    try {
      changeOkLoading(true);
      await setUseYnApi(selectRows, useYnValue!, {
        tenantIdList: selectTenants.map((item) => item.id),
      });
      successMessage(t('common.message.OperationSucceeded'));
      closeModal();
    } finally {
      changeOkLoading(false);
    }
  };
  const [registerTable, { query, getCheckboxRecords }] = useSmartTable({
    border: true,
    stripe: true,
    rowConfig: {
      isHover: true,
    },
    columnConfig: {
      resizable: true,
    },
    proxyConfig: {
      autoLoad: false,
      ajax: {
        query() {
          return listTenantApi({});
        },
      },
    },
    showOverflow: 'tooltip',
    columns: [
      {
        type: 'checkbox',
        width: 60,
        align: 'center',
        fixed: 'left',
        field: 'checkbox',
      },
      {
        field: 'tenantCode',
        title: '{system.views.tenant.manager.title.tenantCode}',
        minWidth: 120,
      },
      {
        field: 'tenantShortName',
        title: '{system.views.tenant.manager.title.tenantShortName}',
        minWidth: 120,
      },
      {
        field: 'tenantName',
        title: '{system.views.tenant.manager.title.tenantName}',
        minWidth: 120,
      },
    ],
  });
</script>

<style scoped lang="less"></style>
