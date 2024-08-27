<script lang="ts" setup>
import { useVbenModal, VbenButton } from '@vben/common-ui';

const [Modal, modalApi] = useVbenModal();
</script>
<template>
  <div>
    <VbenButton @click="() => modalApi.open()">打开弹窗</VbenButton>
    <Modal title="基础示例"> modal content </Modal>
  </div>
</template>
