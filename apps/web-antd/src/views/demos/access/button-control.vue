<script lang="ts" setup>
import type { LoginAndRegisterParams } from '@vben/common-ui';

import { useRouter } from 'vue-router';

import { AccessControl, useAccess } from '@vben/access';

import { Button } from 'ant-design-vue';

import { resetAllStores, useAccessStore } from '#/store';

defineOptions({ name: 'AccessButtonControl' });

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

const { accessMode, hasAccessByCodes } = useAccess();
const accessStore = useAccessStore();
const router = useRouter();

function roleButtonType(role: string) {
  return accessStore.userRoles.includes(role) ? 'primary' : 'default';
}

async function changeAccount(role: string) {
  if (accessStore.userRoles.includes(role)) {
    return;
  }

  const account = accounts[role];
  resetAllStores();
  await accessStore.authLogin(account, async () => {
    router.go(0);
  });
}
</script>

<template>
  <div class="p-5">
    <div class="card-box p-5">
      <h1 class="text-xl font-semibold">
        {{ accessMode === 'frontend' ? '前端' : '后端' }}页面访问权限演示
      </h1>
      <div class="text-foreground/80 mt-2">切换不同的账号，观察按钮变化。</div>
    </div>

    <div class="card-box mt-5 p-5">
      <div class="mb-3">
        <span class="text-lg font-semibold">当前角色:</span>
        <span class="text-primary mx-4 text-lg">
          {{ accessStore.userRoles?.[0] }}
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

    <div class="card-box mt-5 p-5">
      <div class="mb-3 text-lg font-semibold">组件形式控制 - 权限码方式</div>
      <AccessControl :codes="['AC_100100']" type="code">
        <Button class="mr-4"> Super 账号可见 ["AC_1000001"] </Button>
      </AccessControl>
      <AccessControl :codes="['AC_100030']" type="code">
        <Button class="mr-4"> Admin 账号可见 ["AC_100010"] </Button>
      </AccessControl>
      <AccessControl :codes="['AC_1000001']" type="code">
        <Button class="mr-4"> User 账号可见 ["AC_1000001"] </Button>
      </AccessControl>
      <AccessControl :codes="['AC_100100', 'AC_100010']" type="code">
        <Button class="mr-4">
          Super & Admin 账号可见 ["AC_100100","AC_1000001"]
        </Button>
      </AccessControl>
    </div>

    <div v-if="accessMode === 'frontend'" class="card-box mt-5 p-5">
      <div class="mb-3 text-lg font-semibold">组件形式控制 - 用户角色方式</div>
      <AccessControl :codes="['super']">
        <Button class="mr-4"> Super 角色可见 </Button>
      </AccessControl>
      <AccessControl :codes="['admin']">
        <Button class="mr-4"> Admin 角色可见 </Button>
      </AccessControl>
      <AccessControl :codes="['user']">
        <Button class="mr-4"> User 角色可见 </Button>
      </AccessControl>
      <AccessControl :codes="['super', 'admin']">
        <Button class="mr-4"> Super & Admin 角色可见 </Button>
      </AccessControl>
    </div>

    <div class="card-box mt-5 p-5">
      <div class="mb-3 text-lg font-semibold">函数形式控制</div>
      <Button v-if="hasAccessByCodes(['AC_100100'])" class="mr-4">
        Super 账号可见 ["AC_1000001"]
      </Button>
      <Button v-if="hasAccessByCodes(['AC_100030'])" class="mr-4">
        Admin 账号可见 ["AC_100010"]
      </Button>
      <Button v-if="hasAccessByCodes(['AC_1000001'])" class="mr-4">
        User 账号可见 ["AC_1000001"]
      </Button>
      <Button v-if="hasAccessByCodes(['AC_100100', 'AC_1000001'])" class="mr-4">
        Super & Admin 账号可见 ["AC_100100","AC_1000001"]
      </Button>
    </div>
  </div>
</template>
