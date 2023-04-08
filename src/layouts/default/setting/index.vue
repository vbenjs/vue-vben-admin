<template>
  <div @click="openDrawer(true)">
    <VbenIcon icon="ion:settings-outline" />
    <SettingDrawer @register="register" />
  </div>
</template>
<script lang="ts">
  import { VbenIcon } from '@vben/icons';
  import { defineComponent } from 'vue';

  import { useDrawer } from '@/components/Drawer';

  import SettingDrawer from './SettingDrawer';

  export default defineComponent({
    name: 'SettingButton',
    components: { SettingDrawer, VbenIcon },
    setup() {
      const [register, { openDrawer }] = useDrawer();

      return {
        register,
        openDrawer,
      };
    },
  });
</script>
