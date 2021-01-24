<template>
  <div @click="openDrawer" :class="prefixCls">
    <SettingOutlined />
    <SettingDrawer @register="register" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { SettingOutlined } from '@ant-design/icons-vue';
  import SettingDrawer from './SettingDrawer';

  import { useDrawer } from '/@/components/Drawer';
  import { useDesign } from '/@/hooks/web/useDesign';

  export default defineComponent({
    name: 'SettingButton',
    components: { SettingOutlined, SettingDrawer },
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
<style lang="less">
  @prefix-cls: ~'@{namespace}-setting-button';

  .@{prefix-cls} {
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
