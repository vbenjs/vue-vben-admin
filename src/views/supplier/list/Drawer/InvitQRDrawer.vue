<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    title="邀请供应商"
    :width="578"
    destroyOnClose
    showFooter
  >
    <QRCode :value="inviteUrl" />
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { QRCode } from 'ant-design-vue';
  import { useDrawerInner, BasicDrawer } from '@/components/Drawer';

  const inviteUrl = ref<string>('');
  // const emit = defineEmits(['success', 'register']);

  const [registerDrawer] = useDrawerInner(async (data) => {
    inviteUrl.value = data;
  });
</script>
