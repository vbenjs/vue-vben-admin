import type { LoginAndRegisterParams } from '@vben/common-ui';
import type { MenuRecordRaw, UserInfo } from '@vben/types';
import type { RouteRecordRaw } from 'vue-router';

import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import { DEFAULT_HOME_PATH, LOGIN_PATH } from '@vben/constants';
import { resetAllStores, useCoreAccessStore } from '@vben/stores';

import { notification } from 'ant-design-vue';
import { defineStore } from 'pinia';

import { getAccessCodes, getUserInfo, login } from '#/api';
import { $t } from '#/locales';

export const useAccessStore = defineStore('access', () => {
  const coreStoreAccess = useCoreAccessStore();
  const router = useRouter();

  const loading = ref(false);

  const openLoginExpiredModal = ref(false);

  const accessToken = computed(() => coreStoreAccess.accessToken);
  const refreshToken = computed(() => coreStoreAccess.refreshToken);
  const userRoles = computed(() => coreStoreAccess.userRoles);
  const userInfo = computed(() => coreStoreAccess.userInfo);
  const accessRoutes = computed(() => coreStoreAccess.accessRoutes);

  function setAccessMenus(menus: MenuRecordRaw[]) {
    coreStoreAccess.setAccessMenus(menus);
  }

  function setAccessToken(token: null | string) {
    coreStoreAccess.setAccessToken(token);
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
    onSuccess?: () => Promise<void> | void,
  ) {
    // 异步处理用户登录操作并获取 accessToken
    let userInfo: null | UserInfo = null;
    try {
      loading.value = true;
      const { accessToken, refreshToken } = await login(params);

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

        if (openLoginExpiredModal.value) {
          openLoginExpiredModal.value = false;
        } else {
          onSuccess
            ? await onSuccess?.()
            : await router.push(userInfo.homePath || DEFAULT_HOME_PATH);
        }

        if (userInfo?.realName) {
          notification.success({
            description: `${$t('authentication.loginSuccessDesc')}:${userInfo?.realName}`,
            duration: 3,
            message: $t('authentication.loginSuccess'),
          });
        }
      }
    } finally {
      loading.value = false;
    }

    return {
      accessToken,
      userInfo,
    };
  }

  async function logout() {
    resetAllStores();
    openLoginExpiredModal.value = false;

    // 回登陆页带上当前路由地址
    await router.replace({
      path: LOGIN_PATH,
      query: {
        redirect: encodeURIComponent(router.currentRoute.value.fullPath),
      },
    });
  }

  async function fetchUserInfo() {
    let userInfo: null | UserInfo = null;
    userInfo = await getUserInfo();
    coreStoreAccess.setUserInfo(userInfo);
    return userInfo;
  }

  function $reset() {
    loading.value = false;
    openLoginExpiredModal.value = false;
  }

  return {
    $reset,
    accessRoutes,
    accessToken,
    authLogin,
    fetchUserInfo,
    loading,
    logout,
    openLoginExpiredModal,
    refreshToken,
    setAccessMenus,
    setAccessRoutes,
    setAccessToken,
    userInfo,
    userRoles,
  };
});
