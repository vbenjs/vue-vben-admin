<template>
  <div @click="openDrawer" class="setting-button">
    <SettingOutlined />
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
<style lang="less">
  @import (reference) '../../../design/index.less';
  @import './index.less';

  .setting-button {
    position: absolute;
    top: 45%;
    right: 0;
    z-index: 10;
    display: flex;
    padding: 10px;
    color: @white;
    cursor: pointer;
    background: @primary-color;
    border-radius: 6px 0 0 6px;
    justify-content: center;
    align-items: center;

    svg {
      width: 1em;
      height: 1em;
    }
  }
</style>
