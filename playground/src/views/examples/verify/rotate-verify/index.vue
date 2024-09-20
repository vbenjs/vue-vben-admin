<script setup lang="ts">
import { computed } from 'vue';

import { Page, RotateVerify } from '@vben/common-ui';
import { Bell, Sun } from '@vben/icons';
import { preferences } from '@vben/preferences';
import { useUserStore } from '@vben/stores';

import { Card, message } from 'ant-design-vue';

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
    <Card class="flex items-center justify-center p-4">
      <RotateVerify
        :src="avatar"
        text="拖动以进行校验"
        @success="handleSuccess"
      >
        <template #actionIcon="{ isPassing }">
          <Bell v-if="isPassing" />
          <Sun v-else />
        </template>
      </RotateVerify>
    </Card>
  </Page>
</template>
