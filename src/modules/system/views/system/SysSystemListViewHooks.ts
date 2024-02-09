import { ref, unref } from 'vue';
import { message } from 'ant-design-vue';
import { useModal } from '@/components/Modal';

import { setUserApi, getRelatedUserIdApi } from './SysSystemListView.api';

export const useSetUser = (t: Function) => {
  const [registerModal, { openModal, closeModal, setModalProps }] = useModal();
  const selectUserList = ref<number[]>([]);
  const currentSystemRef = ref<Recordable | null>(null);

  const handleUserSelected = async (userIdList: number[]) => {
    selectUserList.value = userIdList;
    try {
      setModalProps({ confirmLoading: true });
      await setUserApi({
        userIdList,
        systemId: unref(currentSystemRef)!.id,
      });
      message.success(t('common.message.OperationSucceeded'));
      closeModal();
    } finally {
      setModalProps({ confirmLoading: false });
    }
  };

  const handleShowSetUser = async (row: Recordable) => {
    currentSystemRef.value = row;
    // 查询关联的用户信息
    openModal(true);
    try {
      setModalProps({ loading: true });
      selectUserList.value = await getRelatedUserIdApi(row.id);
    } finally {
      setModalProps({ loading: false });
    }
  };

  return {
    selectUserList,
    handleUserSelected,
    registerModal,
    handleShowSetUser,
  };
};
