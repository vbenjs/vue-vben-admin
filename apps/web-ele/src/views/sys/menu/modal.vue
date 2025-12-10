<script setup lang="ts">
import { useVbenModal } from '@vben/common-ui';

const [Modal] = useVbenModal({
  draggable: true,
  animationType: 'scale',
});
</script>

<template>
  <Modal title="拖拽示例" />
</template>

<style scoped lang="scss"></style>
