<script lang="ts" setup>
import type { LoginAndRegisterParams } from '@vben/common-ui';

import { useRouter } from 'vue-router';

import { useAccess } from '@vben/access';
import { resetAllStores, useUserStore } from '@vben/stores';

import { Button } from 'ant-design-vue';

import { useAuthStore } from '#/store';

const accounts: Record<string, LoginAndRegisterParams> = {
  admin: {
    password: '123456',
    username: 'admin',
  },
  super: {
    password: '123456',
    username: 'vben',
  },
  user: {
    password: '123456',
    username: 'jack',
  },
};

const { accessMode, toggleAccessMode } = useAccess();
const userStore = useUserStore();
const accessStore = useAuthStore();
const router = useRouter();

function roleButtonType(role: string) {
  return userStore.userRoles.includes(role) ? 'primary' : 'default';
}

async function changeAccount(role: string) {
  if (userStore.userRoles.includes(role)) {
    return;
  }

  const account = accounts[role];
  resetAllStores();
  await accessStore.authLogin(account, async () => {
    router.go(0);
  });
}

async function handleToggleAccessMode() {
  await toggleAccessMode();
  resetAllStores();

  await accessStore.authLogin(accounts.super, async () => {
    setTimeout(() => {
      router.go(0);
    }, 150);
  });
}
</script>

<template>
  <div class="p-5">
    <div class="card-box p-5">
      <h1 class="text-xl font-semibold">
        {{ accessMode === 'frontend' ? '前端' : '后端' }}页面访问权限演示
      </h1>
      <div class="text-foreground/80 mt-2">
        切换不同的账号，观察左侧菜单变化。
      </div>
    </div>

    <div class="card-box mt-5 p-5">
      <span class="text-lg font-semibold">当前权限模式:</span>
      <span class="text-primary mx-4">{{
        accessMode === 'frontend' ? '前端权限控制' : '后端权限控制'
      }}</span>
      <Button type="primary" @click="handleToggleAccessMode">
        切换为{{ accessMode === 'frontend' ? '后端' : '前端' }}权限模式
      </Button>
    </div>
    <div class="card-box mt-5 p-5">
      <div class="mb-3">
        <span class="text-lg font-semibold">当前账号:</span>
        <span class="text-primary mx-4 text-lg">
          {{ userStore.userRoles?.[0] }}
        </span>
      </div>

      <Button :type="roleButtonType('super')" @click="changeAccount('super')">
        切换为 Super 账号
      </Button>

      <Button
        :type="roleButtonType('admin')"
        class="mx-4"
        @click="changeAccount('admin')"
      >
        切换为 Admin 账号
      </Button>
      <Button :type="roleButtonType('user')" @click="changeAccount('user')">
        切换为 User 账号
      </Button>
    </div>
  </div>
</template>
