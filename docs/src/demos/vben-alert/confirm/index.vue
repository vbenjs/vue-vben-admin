<script lang="ts" setup>
import { alert, confirm, VbenButton } from '@vben/common-ui';

function showConfirm() {
  confirm('This is an alert message')
    .then(() => {
      alert('Confirmed');
    })
    .catch(() => {
      alert('Canceled');
    });
}

function showIconConfirm() {
  confirm({
    content: 'This is an alert message with icon',
    icon: 'success',
  });
}

function showAsyncConfirm() {
  confirm({
    beforeClose({ isConfirm }) {
      if (isConfirm) {
        // 这里可以执行一些异步操作。如果最终返回了false，将阻止关闭弹窗
        return new Promise((resolve) => setTimeout(resolve, 2000));
      }
    },
    content: 'This is an alert message with async confirm',
    icon: 'success',
  }).then(() => {
    alert('Confirmed');
  });
}
</script>
<template>
  <div class="flex gap-4">
    <VbenButton @click="showConfirm">Confirm</VbenButton>
    <VbenButton @click="showIconConfirm">Confirm With Icon</VbenButton>
    <VbenButton @click="showAsyncConfirm">Async Confirm</VbenButton>
  </div>
</template>
