<script lang="ts" setup>
import type { LoginExpiredModeType } from '@vben-core/preferences';

import { preferences, updatePreferences } from '@vben-core/preferences';

import { Button } from 'ant-design-vue';

import { getMockStatus } from '#/apis';

defineOptions({ name: 'LoginExpired' });

async function handleClick(type: LoginExpiredModeType) {
  const loginExpiredMode = preferences.app.loginExpiredMode;

  updatePreferences({ app: { loginExpiredMode: type } });
  await getMockStatus('401');
  updatePreferences({ app: { loginExpiredMode } });
}
</script>

<template>
  <div class="p-5">
    <div class="card-box p-5">
      <h1 class="text-xl font-semibold">登录过期演示</h1>
      <div class="text-foreground/80 mt-2">
        401状态码转到登录页，登录成功后跳转回原页面。
      </div>
    </div>

    <div class="card-box mt-5 p-5 font-semibold">
      <div class="mb-3 text-lg">跳转登录页面方式</div>
      <Button type="primary" @click="handleClick('page')"> 点击触发 </Button>
    </div>

    <div class="card-box mt-5 p-5 font-semibold">
      <div class="mb-3 text-lg">登录弹窗方式</div>
      <Button type="primary" @click="handleClick('modal')"> 点击触发 </Button>
    </div>
  </div>
</template>
