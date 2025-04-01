<script lang="ts" setup>
import { h } from 'vue';

import { alert, VbenButton } from '@vben/common-ui';

import { Empty } from 'ant-design-vue';

function showAlert() {
  alert('This is an alert message');
}

function showIconAlert() {
  alert({
    content: 'This is an alert message with icon',
    icon: 'success',
  });
}

function showCustomAlert() {
  alert({
    content: h(Empty, { description: '什么都没有' }),
  });
}
</script>
<template>
  <div class="flex gap-4">
    <VbenButton @click="showAlert">Alert</VbenButton>
    <VbenButton @click="showIconAlert">Alert With Icon</VbenButton>
    <VbenButton @click="showCustomAlert">Alert With Custom Content</VbenButton>
  </div>
</template>
