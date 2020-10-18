<template>
  <div @click="openDrawer" class="setting-button">
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
<style lang="less" scoped>
  @import (reference) '../../../design/index.less';

  .setting-button {
    position: absolute;
    z-index: 10;
    display: flex;
    // padding: 10px;
    color: @white;
    cursor: pointer;
    background: @primary-color;
    justify-content: center;
    align-items: center;
  }
</style>
