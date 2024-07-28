<script lang="ts" setup>
import type { LoginExpiredModeType } from '@vben/types';

import { preferences, updatePreferences } from '@vben/preferences';

import { Button } from 'ant-design-vue';

import { getMockStatus } from '#/api';

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
        接口请求遇到401状态码时，需要重新登录。有两种方式：
        <div>1.转到登录页，登录成功后跳转回原页面</div>
        <div>
          2.弹出重新登录弹窗，登录后关闭弹窗，不进行任何页面跳转（刷新后调整登录页面）
        </div>
      </div>
    </div>

    <div class="card-box mt-5 p-5">
      <div class="mb-3 text-lg font-semibold">跳转登录页面方式</div>
      <Button type="primary" @click="handleClick('page')"> 点击触发 </Button>
    </div>

    <div class="card-box mt-5 p-5">
      <div class="mb-3 text-lg font-semibold">登录弹窗方式</div>
      <Button type="primary" @click="handleClick('modal')"> 点击触发 </Button>
    </div>
  </div>
</template>
