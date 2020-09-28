<template>
  <div
    @click="openDrawer"
    class="setting-button bg-primary flex justify-center items-center text-white p-4 absolute z-10 cursor-pointer"
  >
    <SettingOutlined :spin="true" />
    <SettingDrawer @register="register" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { SettingOutlined } from '@ant-design/icons-vue';
  import SettingDrawer from './SettingDrawer';

  import { useDrawer } from '/@/components/Drawer';
  //
  export default defineComponent({
    name: 'SettingBtn',
    components: { SettingOutlined, SettingDrawer },
    setup() {
      const [register, { openDrawer }] = useDrawer();
      return {
        register,
        openDrawer,
      };
    },
  });
</script>
