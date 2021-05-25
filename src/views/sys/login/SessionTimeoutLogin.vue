<template>
  <transition>
    <div :class="prefixCls">
      <Login sessionTimeout />
    </div>
  </transition>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import Login from './Login.vue';

  import { useDesign } from '/@/hooks/web/useDesign';
  export default defineComponent({
    name: 'SessionTimeoutLogin',
    components: { Login },
    setup() {
      const { prefixCls } = useDesign('st-login');
      return { prefixCls };
    },
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-st-login';

  .@{prefix-cls} {
    position: fixed;
    z-index: 9999999;
    width: 100%;
    height: 100%;
    background: @component-background;
  }
</style>
