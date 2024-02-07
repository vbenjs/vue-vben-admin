import { ref } from 'vue';

import { ApiServiceEnum, defHttp } from '@/utils/http/axios';
import { useMessage } from '@/hooks/web/useMessage';
import { useLoading } from '@/components/Loading';

const { errorMessage, successMessage } = useMessage();

/**
 * 显示账户hook
 */
export const useShowAccount = (t: Function) => {
  const modalVisible = ref(false);
  const userId = ref<number>();
  const dataLoading = ref(false);
  const userData = ref<any>({});
  const accountData = ref<any>({});
  const saveLoading = ref(false);
  /**
   * 显示账户信息
   * @param id 用户ID
   */
  const show = (id: number) => {
    userId.value = id;
    userData.value = {};
    accountData.value = {};
    handleLoadUserAccount();
  };

  /**
   * 加载账户信息
   */
  const handleLoadUserAccount = async () => {
    const [openFullLoading, closeFullLoading] = useLoading({});
    openFullLoading();
    try {
      const result = await defHttp.post({
        service: ApiServiceEnum.SMART_SYSTEM,
        url: '/sys/user/getById',
        data: userId.value,
      });
      if (result) {
        userData.value = result;
        if (result.userAccount) {
          accountData.value = result.userAccount;
          modalVisible.value = true;
        } else {
          errorMessage(t('system.views.user.message.noAccount'));
        }
      } else {
        userData.value = {};
        accountData.value = {};
      }
    } finally {
      closeFullLoading();
    }
  };

  /**
   * 执行保存操作
   */
  const handleSave = async () => {
    try {
      saveLoading.value = true;
      await defHttp.post({
        service: ApiServiceEnum.SMART_SYSTEM,
        url: '/sys/user/saveAccountSetting',
        data: accountData.value,
      });
      modalVisible.value = false;
      successMessage(t('common.message.editSuccess'));
    } finally {
      saveLoading.value = false;
    }
  };

  return {
    modalVisible,
    show,
    userId,
    dataLoading,
    userData,
    accountData,
    handleSave,
    saveLoading,
  };
};
