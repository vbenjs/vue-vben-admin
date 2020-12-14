<template>
  <span @click="handleLock">
    <Tooltip :title="t('layout.header.tooltipLock')" placement="bottom" :mouseEnterDelay="0.5">
      <LockOutlined />
    </Tooltip>
    <LockAction @register="register" />
  </span>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { Tooltip } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { LockOutlined } from '@ant-design/icons-vue';
  import { useModal } from '/@/components/Modal';
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
  export default defineComponent({
    name: 'FullScreen',
    components: {
      LockOutlined,
      Tooltip,
      LockAction: createAsyncComponent(() => import('./LockModal.vue')),
    },

    setup() {
      const { t } = useI18n();
      const [register, { openModal }] = useModal();

      function handleLock() {
        openModal(true);
      }
      return {
        t,
        register,
        handleLock,
      };
    },
  });
</script>
