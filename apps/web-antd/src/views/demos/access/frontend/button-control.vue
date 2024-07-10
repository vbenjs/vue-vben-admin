<script lang="ts" setup>
import type { LoginAndRegisterParams } from '@vben/universal-ui';

import { useRouter } from 'vue-router';

import { CodeAccess, RoleAccess, useAccess } from '@vben/access';

import { Button } from 'ant-design-vue';

import { useAccessStore, useAppStore } from '#/store';

defineOptions({ name: 'AccessFrontendButtonControl' });

const { accessMode, hasAuthByCodes, hasAuthByRoles } = useAccess();
const accessStore = useAccessStore();
const appStore = useAppStore();
const router = useRouter();

function roleButtonType(role: string) {
  return accessStore.userRoles.includes(role) ? 'primary' : 'default';
}

async function changeAccount(role: string) {
  if (accessStore.userRoles.includes(role)) {
    return;
  }
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
  const account = accounts[role];
  await appStore.resetAppState();
  await accessStore.authLogin(account, async () => {
    router.go(0);
  });
}
</script>

<template>
  <div class="p-5">
    <div class="card-box p-5">
      <h1 class="text-xl font-semibold">前端按钮访问权限演示</h1>
      <div class="text-foreground/80 mt-2">
        切换不同的账号，观察按钮显示变化
      </div>
    </div>

    <template v-if="accessMode === 'frontend'">
      <div class="card-box mt-5 p-5 font-semibold">
        <div class="mb-3">
          <span class="text-lg">当前账号:</span>
          <span class="text-primary mx-4">
            {{ accessStore.userRoles }}
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
      <div class="card-box mt-5 p-5 font-semibold">
        <div class="mb-3 text-lg">角色 - 组件形式控制</div>
        <RoleAccess :value="['super']">
          <Button class="mr-4"> Super 角色可见 </Button>
        </RoleAccess>
        <RoleAccess :value="['admin']">
          <Button class="mr-4"> Admin 角色可见 </Button>
        </RoleAccess>
        <RoleAccess :value="['user']">
          <Button class="mr-4"> User 角色可见 </Button>
        </RoleAccess>
        <RoleAccess :value="['super', 'admin']">
          <Button class="mr-4"> Super & Admin 角色都可见 </Button>
        </RoleAccess>
      </div>

      <div class="card-box mt-5 p-5 font-semibold">
        <div class="mb-3 text-lg">角色 - 函数形式控制</div>
        <Button v-if="hasAuthByRoles(['super'])" class="mr-4">
          Super 角色可见
        </Button>
        <Button v-if="hasAuthByRoles(['admin'])" class="mr-4">
          Admin 角色可见
        </Button>
        <Button v-if="hasAuthByRoles(['user'])" class="mr-4">
          User 角色可见
        </Button>
        <Button v-if="hasAuthByRoles(['super', 'admin'])" class="mr-4">
          Super & Admin 角色都可见
        </Button>
      </div>

      <div class="card-box mt-5 p-5 font-semibold">
        <div class="mb-3 text-lg">权限码 - 组件形式控制</div>
        <CodeAccess :value="['AC_100100']">
          <Button class="mr-4"> Super 账号可见 ["AC_1000001"] </Button>
        </CodeAccess>
        <CodeAccess :value="['AC_100030']">
          <Button class="mr-4"> Admin 账号可见 ["AC_100010"] </Button>
        </CodeAccess>
        <CodeAccess :value="['AC_1000001']">
          <Button class="mr-4"> User 账号可见 ["AC_1000001"] </Button>
        </CodeAccess>
        <CodeAccess :value="['AC_100100', 'AC_100010']">
          <Button class="mr-4">
            Super & Admin 账号可见 ["AC_100100","AC_1000001"]
          </Button>
        </CodeAccess>
      </div>

      <div class="card-box mt-5 p-5 font-semibold">
        <div class="mb-3 text-lg">权限码 - 函数形式控制</div>
        <Button v-if="hasAuthByCodes(['AC_100100'])" class="mr-4">
          Super 账号可见 ["AC_1000001"]
        </Button>
        <Button v-if="hasAuthByCodes(['AC_100030'])" class="mr-4">
          Admin 账号可见 ["AC_100010"]
        </Button>
        <Button v-if="hasAuthByCodes(['AC_1000001'])" class="mr-4">
          User 账号可见 ["AC_1000001"]
        </Button>
        <Button v-if="hasAuthByCodes(['AC_100100', 'AC_1000001'])" class="mr-4">
          Super & Admin 账号可见 ["AC_100100","AC_1000001"]
        </Button>
      </div>
    </template>
  </div>
</template>
