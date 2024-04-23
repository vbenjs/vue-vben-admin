<template>
  <div class="full-height page-container">
    <SmartLayoutSeparate :show-line="false" first-size="280px" class="full-height">
      <template #first>
        <div class="full-height dept-container">
          <SysDeptTree async show-search @select="handleDeptSelected" />
        </div>
      </template>
      <template #second>
        <SmartTable @register="registerTable" :size="getTableSize">
          <template #table-operation="{ row }">
            <SmartVxeTableAction :actions="getTableActions(row)" />
          </template>
          <template #table-userType="{ row }">
            <span>
              {{ getUserTypeMap[row.userType] }}
            </span>
          </template>
          <template #search-userType="{ model, size }">
            <a-select style="width: 100px" :size="size" v-model:value="model.userType" allowClear>
              <a-select-option
                v-for="item in userTypeListRef"
                :key="'userType_' + item.dictItemCode"
                :value="item.dictItemCode"
              >
                {{ item.dictItemName }}
              </a-select-option>
            </a-select>
          </template>
          <template #table-accountStatus="{ row }">
            <a-tooltip :title="getLockedMessage(row.userAccount?.accountStatus)">
              <span
                :style="{
                  color: getAccountData(row.userAccount?.accountStatus).color,
                  fontWeight: 'bold',
                }"
              >
                {{ getAccountData(row.userAccount?.accountStatus).label }}
              </span>
            </a-tooltip>
          </template>
        </SmartTable>
      </template>
    </SmartLayoutSeparate>
    <UserAccountUpdateModal @register="registerAccountModal" />
    <UserSetRole @register="registerSetRoleModal" />
    <UserUseYnModal @register="registerUseYnModal" />
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, unref } from 'vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { storeToRefs } from 'pinia';

  import { useLoadDictItem } from '@/modules/smart-system/hooks/SysDictHooks';
  import { useSizeSetting } from '@/hooks/setting/UseSizeSetting';
  import { hasPermission } from '@/utils/auth';
  import { useModal } from '@/components/Modal';
  import { useUserStore } from '@/store/modules/user';

  import { SmartLayoutSeparate } from '@/components/SmartLayoutSeparate';
  import SysDeptTree from '@/modules/smart-system/components/SysDept/SysDeptTree.vue';
  import { useMessage } from '@/hooks/web/useMessage';

  import {
    SmartTable,
    useSmartTable,
    SmartVxeTableAction,
    ActionItem,
  } from '@/components/SmartTable';
  import UserAccountUpdateModal from './account/UserAccountUpdateModal.vue';
  import UserSetRole from './components/UserSetRole.vue';
  import UserUseYnModal from './components/UserUseYnModal.vue';

  import { getAddEditFormSchemas, getSearchSchemas, getTableColumns } from './UserListView.config';
  import {
    listApi,
    deleteApi,
    saveUpdateWithDataScopeApi,
    getByIdWithDataScopeApi,
    setUseYnApi,
    createAccountApi,
    unlockUserAccountApi,
    resetPassword,
  } from './UserListView.api';
  import {
    SYS_USER_TYPE,
    SystemPermissions,
  } from '@/modules/smart-system/constants/SystemConstants';
  import { copyText } from '@/utils/copyTextToClipboard';

  const { t } = useI18n();
  const { warnMessage, errorMessage, createConfirm, successMessage } = useMessage();
  const { getTableSize } = useSizeSetting();
  const { getIsPlatformTenant } = storeToRefs(useUserStore());
  const [registerUseYnModal, { openModal: openUseYnModal }] = useModal();

  const { dictData: userTypeListRef } = useLoadDictItem(ref('SYSTEM_USER_TYPE'));
  const getUserTypeMap = computed(() => {
    const result: { [index: string]: string } = {};
    result[SYS_USER_TYPE] = '系统用户';
    for (let userType of unref(userTypeListRef)) {
      result[userType.dictItemCode] = userType.dictItemName;
    }
    return result;
  });

  const accountLockedMessage = {
    LOGIN_FAIL_LOCKED: '多次登录失败锁定',
    LONG_TIME_LOCKED: '超出指定时间未登录锁定',
    LONG_TIME_PASSWORD_MODIFY_LOCKED: '超出指定时间未修改密码锁定',
  };

  const [registerSetRoleModal, { openModal: openSetRoleModal }] = useModal();

  const getLockedMessage = (status: string | null | undefined) => {
    if (!status || status === 'NORMAL') {
      return '正常';
    }
    return accountLockedMessage[status];
  };

  /**
   * 账户状态
   */
  const accountStatusMap = {
    empty: {
      label: '未创建',
      color: '#A9A9A9',
    },
    NORMAL: {
      label: '正常',
      color: '#228B22',
    },
    LOCKED: {
      label: '锁定',
      color: 'red',
    },
  };

  const getAccountData = (status: string | null | undefined) => {
    if (status === undefined || status === null) {
      return accountStatusMap.empty;
    }
    if (status === 'NORMAL') {
      return accountStatusMap.NORMAL;
    }
    return accountStatusMap.LOCKED;
  };

  /**
   * 权限处理
   */
  const permissions = SystemPermissions.user;
  const hasPermissionUpdateSystemUser = hasPermission('sys:systemUser:update');
  const hasSystemUserUpdate = (type: string) => {
    return hasPermissionUpdateSystemUser || type !== SYS_USER_TYPE;
  };

  /**
   * 选中组织架构操作
   * @param selectedKeys
   */
  const currentDeptId = ref<number | null>(null);
  const handleDeptSelected = (selectedKeys: Array<number>) => {
    if (selectedKeys.length > 0) {
      currentDeptId.value = selectedKeys[0];
    } else {
      currentDeptId.value = null;
    }
    // 重新加载数据
    query();
  };

  /**
   * 账户弹窗
   */
  const [registerAccountModal, { openModal }] = useModal();

  /**
   * table行按钮
   */
  const getTableActions = (row): ActionItem[] => {
    return [
      {
        label: t('common.button.edit'),
        onClick: () => editByRowModal(row),
        disabled: !hasPermission(permissions.update) || !hasSystemUserUpdate(row.userType),
      },
      {
        label: t('system.views.user.button.showAccount'),
        disabled: !hasPermission('sys:account:query') || !hasSystemUserUpdate(row.userType),
        onClick: () => openModal(true, row),
      },
      {
        label: t('system.views.user.button.unlockUserAccount'),
        auth: permissions.unlockUserAccount,
        disabled:
          !hasPermission(permissions.unlockUserAccount) ||
          !row.userAccount ||
          (row.userAccount && row.userAccount.accountStatus === 'NORMAL'),
        onClick: () => handleUnlockUserAccount(row.userId),
      },
    ];
  };

  const handleUnlockUserAccount = (id: number) => {
    createConfirm({
      iconType: 'warning',
      content: t('system.views.user.message.confirmUnlockUserAccount'),
      onOk: async () => {
        await unlockUserAccountApi(id);
        successMessage(t('system.views.user.message.unlockUserAccountSuccess'));
        await query();
      },
    });
  };

  /**
   * 用户操作验证
   * @param userList
   */
  const validateOperateUser = (userList: Array<any>) => {
    if (userList.length === 0) {
      warnMessage({
        message: t('system.views.user.validate.selectUser'),
      });
      return false;
    }
    if (!hasPermissionUpdateSystemUser) {
      // 如果没有修改系统用户的权限，判断用户中是否有系统用户
      const hasSysUser = userList.some(({ userType }: any) => userType === SYS_USER_TYPE);
      if (hasSysUser) {
        errorMessage(t('system.views.user.validate.noSysUserUpdatePermission'));
        return false;
      }
    }
    return true;
  };

  /**
   * 创建账户
   */
  const handleCreateAccount = () => {
    const userList = getCheckboxRecords(false);
    if (userList.length === 0) {
      warnMessage({
        message: t('system.views.user.validate.selectUser'),
      });
      return false;
    }
    if (!hasPermissionUpdateSystemUser) {
      // 如果没有修改系统用户的权限，判断用户中是否有系统用户
      const hasSysUser = userList.some(({ userType }: any) => userType === SYS_USER_TYPE);
      if (hasSysUser) {
        errorMessage(t('system.views.user.validate.noSysUserUpdatePermission'));
        return false;
      }
    }
    // 判断是否有停用用户
    const hasNoUse = userList.some((item) => item.useYn === false);
    if (hasNoUse) {
      warnMessage(t('system.views.user.message.noUseUserNotCreateAccount'));
      return false;
    }
    createConfirm({
      iconType: 'warning',
      title: t('system.views.user.validate.createAccountConfirm'),
      onOk: async () => {
        await createAccountApi(userList);
        successMessage(t('common.message.OperationSucceeded'));
        query();
      },
    });
  };

  const validateSelectRows = () => {
    const rows = getCheckboxRecords();
    if (!rows.length) {
      warnMessage(t('common.notice.select'));
      return false;
    }
    return rows;
  };

  const [
    registerTable,
    { editByRowModal, getCheckboxRecords, query, deleteByCheckbox, showAddModal, useYnByCheckbox },
  ] = useSmartTable({
    columns: getTableColumns(),
    stripe: true,
    height: 'auto',
    border: true,
    align: 'left',
    rowConfig: {
      isHover: true,
    },
    pagerConfig: true,
    useSearchForm: true,
    sortConfig: {
      remote: true,
      defaultSort: {
        field: 'seq',
        order: 'asc',
      },
    },
    searchFormConfig: {
      layout: 'inline',
      schemas: getSearchSchemas(t),
      colon: true,
      searchWithSymbol: true,
      actionColOptions: {
        span: undefined,
      },
      compact: true,
    },
    addEditConfig: {
      modalConfig: {
        width: '700px',
      },
      formConfig: {
        colon: true,
        schemas: getAddEditFormSchemas(t, userTypeListRef),
        labelCol: {
          span: 4,
        },
        wrapperCol: {
          span: 19,
        },
        baseColProps: {
          span: 24,
        },
      },
    },
    proxyConfig: {
      ajax: {
        query: ({ ajaxParameter }) => {
          const parameter = {
            ...ajaxParameter,
          };
          const deptId = unref(currentDeptId);
          if (deptId) {
            parameter.deptIdList = [deptId];
          }
          return listApi(parameter);
        },
        delete: deleteApi,
        save: saveUpdateWithDataScopeApi,
        getById: getByIdWithDataScopeApi,
        useYn: setUseYnApi,
      },
    },
    toolbarConfig: {
      refresh: true,
      resizable: true,
      buttons: [
        {
          code: 'ModalAdd',
          auth: permissions.add,
          props: {
            onClick: () => {
              showAddModal({ deptId: unref(currentDeptId) });
            },
          },
        },
        {
          name: t('system.views.user.button.createAccount'),
          customRender: 'ant',
          auth: permissions.createAccount,
          props: {
            onClick: () => handleCreateAccount(),
            type: 'primary',
          },
        },
        {
          code: 'delete',
          props: {
            onClick: () => {
              const userList = getCheckboxRecords(false);
              // 验证用户
              const result = validateOperateUser(userList);
              if (!result) {
                return false;
              }
              // 验证是否包含系统用户
              const sysUserValidate = userList.some((item: any) => item.userType === SYS_USER_TYPE);
              if (sysUserValidate) {
                errorMessage(t('system.views.user.validate.sysUserNoDelete'));
                return false;
              }
              // 执行删除操作
              deleteByCheckbox();
            },
          },
        },
        {
          code: 'useYnTrue',
          props: {
            onClick() {
              if (!unref(getIsPlatformTenant)) {
                useYnByCheckbox(true);
              } else {
                const rows = validateSelectRows();
                if (!rows) {
                  return false;
                }
                openUseYnModal(true, { rows, useYn: true });
              }
            },
          },
        },
        {
          code: 'useYnFalse',
          props: {
            onClick() {
              if (!unref(getIsPlatformTenant)) {
                useYnByCheckbox(true);
              } else {
                const rows = validateSelectRows();
                if (!rows) {
                  return false;
                }
                openUseYnModal(true, { rows, useYn: false });
              }
            },
          },
        },
        {
          name: t('system.views.user.button.resetPassword'),
          auth: permissions.unlockPassword,
          customRender: 'ant',
          props: {
            type: 'primary',
            preIcon: 'ant-design:unlock-outlined',
            onClick: () => {
              const selectRows = getCheckboxRecords(false);
              if (selectRows.length !== 1) {
                warnMessage('请选择一条数据');
                return;
              }
              createConfirm({
                iconType: 'warning',
                title: t('system.views.user.button.resetPassword'),
                content: t('system.views.user.validate.resetPassword'),
                onOk: async () => {
                  const newPassword = await resetPassword(selectRows[0].userId);
                  createConfirm({
                    iconType: 'warning',
                    okText: t('system.views.user.button.copyPassword'),
                    onOk: () => {
                      copyText(newPassword);
                    },
                    title: t('system.views.user.message.resetSavePassword'),
                    content: newPassword,
                  });
                },
              });
            },
          },
        },
        {
          name: t('system.views.user.button.setRole'),
          auth: permissions.setRole,
          customRender: 'ant',
          props: {
            type: 'primary',
            preIcon: 'ant-design:team-outlined',
            onClick: () => {
              const selectRows = getCheckboxRecords(false);
              if (selectRows.length !== 1) {
                warnMessage('请选择一条数据');
                return;
              }
              openSetRoleModal(true, { userId: selectRows[0].userId });
            },
          },
        },
      ],
    },
  });
</script>

<style scoped lang="less">
  .page-container {
    :deep(.smart-search-container) {
      .ant-col {
        //padding: 0 5px;
      }
    }
  }

  .dept-container {
    margin-right: 5px;
    padding: 10px;
    background: white;
  }
</style>
