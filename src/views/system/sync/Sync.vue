<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <ApiButton type="primary" :api="handleSyncVerify" v-auth="'sync_verify'">
          检查重置
        </ApiButton>
        <a-button
          type="primary"
          preIcon="ant-design:sync-outlined"
          @click="handleSync"
          v-auth="'sync_sync'"
        >
          同步
        </a-button>
      </template>
    </BasicTable>

    <SyncStatusModal @success="reload" @register="registerModal" />
  </div>
</template>
<script lang="tsx" setup>
  import { BasicTable, useTable } from '@/components/Table';
  import { getFormConfig, getColumns } from './data';
  import { useMessage } from '@/hooks/web/useMessage';

  import { getSyncOther, sync, syncAll, syncVerify } from '@/api/warehouse/product';
  import { MesPackageForm } from '@/ApiModel/warehouse/product';
  import { useModal } from '@/components/Modal';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';
  import { ApiButton } from '@/components/Button';

  defineOptions({ name: 'Sync' });

  const SyncStatusModal = createAsyncComponent(() => import('./SyncStatusModal.vue'));

  const { createMessage: msg, createConfirm } = useMessage();
  const [registerModal, { openModal }] = useModal();
  const [registerTable, { getSelectRows, getForm, reload }] = useTable({
    api: (where) => getSyncOther(where, true),
    columns: getColumns(),
    rowKey: 'barCode',
    useSearchForm: true,
    formConfig: getFormConfig(),
    showTableSetting: true,
    loading: true,
    showIndexColumn: false,
    rowSelection: {
      type: 'checkbox',
    },
  });

  const handleSync = async () => {
    const selectRows = getSelectRows() as MesPackageForm[];
    createConfirm({
      title: '提示',
      iconType: 'info',
      content: `是否同步${selectRows.length ? '选中的' + selectRows.length + '条' : '全部'}数据？`,
      onOk: async () => {
        if (selectRows.length === 0) {
          const form = getForm().getFieldsValue();
          await syncAll(form as any);
        } else {
          const codes = selectRows.map((item) => item.barCode);
          await sync(codes);
        }

        msg.success('开始同步！');
        openModal(true, {});
      },
    });
  };
  const handleSyncVerify = () => {
    return new Promise((resolve) => {
      createConfirm({
        title: '提示',
        iconType: 'info',
        content: `是否确认执行检查重置？`,
        onOk: async () => {
          await syncVerify();
          resolve(true);
        },
        onCancel: () => {
          resolve(false);
        },
      });
    });
  };
</script>
