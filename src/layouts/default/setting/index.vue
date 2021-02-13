<template>
  <div @click="openDrawer" :class="prefixCls">
    <Icon icon="ion:settings-outline" />
    <SettingDrawer @register="register" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import SettingDrawer from './SettingDrawer';
  import Icon from '/@/components/Icon';

  import { useDrawer } from '/@/components/Drawer';
  import { useDesign } from '/@/hooks/web/useDesign';

  export default defineComponent({
    name: 'SettingButton',
    components: { SettingDrawer, Icon },
    setup() {
      const [register, { openDrawer }] = useDrawer();

      const { prefixCls } = useDesign('setting-button');
      return {
        prefixCls,
        register,
        openDrawer,
      };
    },
  });
</script>
