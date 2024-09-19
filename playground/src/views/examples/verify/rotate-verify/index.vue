<script setup lang="ts">
import { computed } from 'vue';

import { Page, RotateVerify } from '@vben/common-ui';
import { preferences } from '@vben/preferences';
import { useUserStore } from '@vben/stores';

import { message } from 'ant-design-vue';

const userStore = useUserStore();
function handleSuccess() {
  message.success('success!');
}

const avatar = computed(() => {
  return userStore.userInfo?.avatar || preferences.app.defaultAvatar;
});
</script>

<template>
  <Page title="旋转校验示例">
    <div class="flex items-center justify-center p-4">
      <RotateVerify :src="avatar" @success="handleSuccess" />
    </div>
  </Page>
</template>
