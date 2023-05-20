<template>
  <PageWrapper title="Ripple示例">
    <div class="demo-box" v-ripple>content</div>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import RippleDirective from '/@/directives/ripple';
  import { PageWrapper } from '/@/components/Page';

  export default defineComponent({
    components: { PageWrapper },
    directives: {
      Ripple: RippleDirective,
    },
  });
</script>

<style lang="less" scoped>
  .demo-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 300px;
    height: 300px;
    border-radius: 10px;
    background-color: #408ede;
    color: #fff;
    font-size: 24px;
  }
</style>
