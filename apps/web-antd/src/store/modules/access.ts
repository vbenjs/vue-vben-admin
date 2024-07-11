import type { MenuRecordRaw, UserInfo } from '@vben/types';
import type { LoginAndRegisterParams } from '@vben/universal-ui';
import type { RouteRecordRaw } from 'vue-router';

import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import { DEFAULT_HOME_PATH } from '@vben/constants';
import { useCoreAccessStore } from '@vben-core/stores';

import { defineStore } from 'pinia';

import { getAccessCodes, getUserInfo, userLogin } from '#/apis';

export const useAccessStore = defineStore('access', () => {
  const coreStoreAccess = useCoreAccessStore();
  const router = useRouter();
  const loading = ref(false);

  const showLoginDialog = ref(false);
  function setShowLoginDialog(value: boolean) {
    showLoginDialog.value = value;
  }

  const accessToken = computed(() => coreStoreAccess.accessToken);
  const userRoles = computed(() => coreStoreAccess.userRoles);
  const userInfo = computed(() => coreStoreAccess.userInfo);
  const accessRoutes = computed(() => coreStoreAccess.accessRoutes);

  function setAccessMenus(menus: MenuRecordRaw[]) {
    coreStoreAccess.setAccessMenus(menus);
  }

  function setAccessRoutes(routes: RouteRecordRaw[]) {
    coreStoreAccess.setAccessRoutes(routes);
  }

  /**
   * 异步处理登录操作
   * Asynchronously handle the login process
   * @param params 登录表单数据
   */
  async function authLogin(
    params: LoginAndRegisterParams,
    onSuccess?: () => Promise<void>,
  ) {
    // 异步处理用户登录操作并获取 accessToken
    let userInfo: UserInfo | null = null;
    try {
      loading.value = true;
      const { accessToken, refreshToken } = await userLogin(params);

      // 如果成功获取到 accessToken
      // If accessToken is successfully obtained
      if (accessToken) {
        // 将 accessToken 存储到 accessStore 中
        // Store the accessToken in accessStore
        coreStoreAccess.setAccessToken(accessToken);
        coreStoreAccess.setRefreshToken(refreshToken);

        // 获取用户信息并存储到 accessStore 中
        // Get user information and store it in accessStore
        const [fetchUserInfoResult, accessCodes] = await Promise.all([
          fetchUserInfo(),
          getAccessCodes(),
        ]);

        userInfo = fetchUserInfoResult;

        coreStoreAccess.setUserInfo(userInfo);
        coreStoreAccess.setAccessCodes(accessCodes);

        showLoginDialog.value = false;
        onSuccess
          ? await onSuccess?.()
          : await router.push(userInfo.homePath || DEFAULT_HOME_PATH);
      }
    } finally {
      loading.value = false;
    }

    return {
      accessToken,
      userInfo,
    };
  }

  async function fetchUserInfo() {
    let userInfo: UserInfo | null = null;
    userInfo = await getUserInfo();
    coreStoreAccess.setUserInfo(userInfo);
    return userInfo;
  }

  function reset() {
    coreStoreAccess.$reset();
  }

  return {
    accessRoutes,
    accessToken,
    authLogin,
    fetchUserInfo,
    loading,
    reset,
    setAccessMenus,
    setAccessRoutes,
    setShowLoginDialog,
    showLoginDialog,
    userInfo,
    userRoles,
  };
});
