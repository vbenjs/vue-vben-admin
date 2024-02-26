<template>
  <BasicModal
    @register="registerModal"
    :title="t('system.views.user.button.setRole')"
    @ok="handleSaveUserRole"
  >
    <SmartTable @register="registerTable" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { SmartTable, useSmartTable } from '@/components/SmartTable';
  import { ref, unref } from 'vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { ApiServiceEnum, defHttp } from '@/utils/http/axios';

  import { setUserRoleApi } from '../UserListView.api';
  import { successMessage } from '@/utils/message/SystemNotice';

  const { t } = useI18n();

  const currentUserId = ref<number | null>(null);

  const [registerModal, { changeOkLoading, closeModal }] = useModalInner(async ({ userId }) => {
    currentUserId.value = userId;
    await query();
    await setSelectRole();
  });

  const setSelectRole = async () => {
    const userId = unref(currentUserId)!;
    const roleList: any[] = await defHttp.post({
      service: ApiServiceEnum.SMART_SYSTEM,
      url: 'sys/user/listUserRole',
      data: { id: userId },
    });
    const tableInstance = getTableInstance();
    tableInstance.clearCheckboxRow();
    tableInstance.setCheckboxRow(
      roleList.map((item) => ({ roleId: item.roleId })),
      true,
    );
  };

  const handleSaveUserRole = async () => {
    const tableInstance = getTableInstance();
    const roleIdList = tableInstance.getCheckboxRecords().map((item) => item.roleId);
    try {
      changeOkLoading(true);
      await setUserRoleApi({
        userId: unref(currentUserId),
        roleIdList,
      });
      successMessage(t('system.views.user.message.setRoleSuccess'));
      closeModal();
    } finally {
      changeOkLoading(false);
    }
  };

  const [registerTable, { query, getTableInstance }] = useSmartTable({
    border: true,
    size: 'small',
    rowConfig: {
      isHover: true,
      keyField: 'roleId',
    },
    stripe: true,
    checkboxConfig: {
      rowTrigger: 'multiple',
      highlight: true,
    },
    proxyConfig: {
      autoLoad: false,
      ajax: {
        query: ({ ajaxParameter }) => {
          return defHttp.post({
            service: ApiServiceEnum.SMART_SYSTEM,
            url: 'sys/role/list',
            data: {
              sortName: 'seq',
              ...ajaxParameter,
              parameter: {
                ...ajaxParameter?.parameter,
                'useYn@=': true,
              },
            },
          });
        },
      },
    },
    columns: [
      {
        type: 'checkbox',
        width: 50,
      },
      {
        title: '#',
        type: 'seq',
        width: 50,
      },
      {
        title: '角色编码',
        field: 'roleCode',
        width: 160,
      },
      {
        title: '角色名称',
        field: 'roleName',
        minWidth: 160,
      },
    ],
  });
</script>

<style scoped lang="less"></style>
