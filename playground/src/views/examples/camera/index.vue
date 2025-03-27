<script setup lang="ts">
import { ref } from 'vue';

import { Camera } from '@vben/common-ui';

const photo = ref<null | string>(null);
const cameraRef = ref();

async function handleSuccess(photo: string) {
  console.error('拍照成功:', photo);
}

function handleError(error: Error) {
  console.error('拍照失败:', error);
}
</script>

<template>
  <div class="h-[300px] w-[500px]">
    <Camera
      v-model="photo"
      facing-mode="user"
      @success="handleSuccess"
      @error="handleError"
      ref="cameraRef"
    />
  </div>
</template>
