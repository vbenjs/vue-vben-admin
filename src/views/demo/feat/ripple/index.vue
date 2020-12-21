<template>
  <div class="p-4">
    <div class="demo-box" v-ripple>content</div>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { Alert } from 'ant-design-vue';
  import RippleDirective from '/@/directives/ripple';
  export default defineComponent({
    components: { Alert },
    directives: {
      Ripple: RippleDirective,
    },
    setup() {
      return {};
    },
  });
</script>

<style lang="less" scoped>
  .demo-box {
    display: flex;
    width: 300px;
    height: 300px;
    font-size: 24px;
    color: #fff;
    background: #408ede;
    border-radius: 10px;
    justify-content: center;
    align-items: center;
  }
</style>
