<script lang="ts" setup>
import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
  onConfirm() {
    message.info('onConfirm');
    // modalApi.close();
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      modalApi.setState({ loading: true });
      setTimeout(() => {
        modalApi.setState({ loading: false });
      }, 2000);
    }
  },
});
</script>
<template>
  <Modal class="w-[600px]" title="基础弹窗示例" title-tooltip="标题提示内容">
    base demo
  </Modal>
</template>
