import { useModal } from '@/components/Modal';
import { ref, unref } from 'vue';
import { message } from 'ant-design-vue';

import { listUserIdByGroupIdApi, setUserApi } from '../UserGroupListView.api';

/**
 * 设置用户组人员信息
 */
export const useSetUser = (t: Function) => {
  const [registerSetUserModal, { openModal, setModalProps, closeModal }] = useModal();
  const currentUserGroup = ref<Recordable | null>(null);
  const selectUserList = ref<number[]>([]);

  /**
   * 显示设置用户弹窗
   * @param userGroup
   */
  const handleShowSetUser = async (userGroup: Recordable) => {
    currentUserGroup.value = userGroup;
    openModal(true);
    try {
      setModalProps({ loading: true });
      // 获取已关联的用户信息
      selectUserList.value = await listUserIdByGroupIdApi(userGroup.groupId);
    } finally {
      setModalProps({ loading: false });
    }
  };

  /**
   * 设置用户
   * @param userIdList
   */
  const handleUserSelected = async (userIdList: number[]) => {
    selectUserList.value = userIdList;
    try {
      setModalProps({ confirmLoading: true });
      await setUserApi(unref(currentUserGroup)!.groupId, userIdList);
      message.success(t('common.message.OperationSucceeded'));
      closeModal();
    } finally {
      setModalProps({ confirmLoading: false });
    }
  };

  return {
    registerSetUserModal,
    handleShowSetUser,
    handleUserSelected,
    selectUserList,
  };
};
