import { useModal } from '@/components/Modal';
import { message } from 'ant-design-vue';
import { ref, unref } from 'vue';

import { listUserByRoleIdApi, setRoleUserApi } from '../RoleListView.api';

export const useRoleSetUser = (t: Function) => {
  const [registerSetUserModal, { openModal, setModalProps, closeModal }] = useModal();
  const currentRole = ref<Recordable | null>(null);
  const selectUserList = ref<number[]>([]);

  const handleShowSetUser = async (role: Recordable) => {
    currentRole.value = role;
    openModal(true, { a: 1 });
    try {
      setModalProps({ loading: true });
      const result = await listUserByRoleIdApi([role.roleId]);
      selectUserList.value = result.map((item) => item.userId);
    } finally {
      setModalProps({ loading: false });
    }
  };

  const handleSetUser = async (userId: number[]) => {
    selectUserList.value = userId;
    try {
      setModalProps({ confirmLoading: true });
      await setRoleUserApi(unref(currentRole)!.roleId, userId);
      message.success(t('common.message.OperationSucceeded'));
      closeModal();
    } finally {
      setModalProps({ confirmLoading: false });
    }
  };

  return {
    selectUserList,
    handleShowSetUser,
    registerSetUserModal,
    handleSetUser,
  };
};
