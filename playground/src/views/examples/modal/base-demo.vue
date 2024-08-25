<script lang="ts" setup>
import { onMounted } from 'vue';

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
});

onMounted(() => {
  modalApi.setState({ loading: true });
  setTimeout(() => {
    modalApi.setState({ loading: false });
  }, 2000);
});
</script>
<template>
  <Modal :fullscreen-button="false" class="w-[600px]" title="基础弹窗示例">
    base demo
  </Modal>
</template>
