<script lang="ts" setup>
import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
  onClosed() {
    message.info('onClosed：关闭动画结束');
  },
  onConfirm() {
    message.info('onConfirm');
    // modalApi.close();
  },
  onOpened() {
    message.info('onOpened：打开动画结束');
  },
});
</script>
<template>
  <Modal class="w-[600px]" title="基础弹窗示例" title-tooltip="标题提示内容">
    base demo
  </Modal>
</template>
