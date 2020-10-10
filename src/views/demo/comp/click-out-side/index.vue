<template>
  <div class="px-10">
    <Alert message="点内外部触发事件" show-icon class="mt-4"></Alert>
    <ClickOutSide @clickOutside="handleClickOutside" class="flex justify-center mt-10">
      <div @click="innerClick" class="demo-box">
        {{ text }}
      </div>
    </ClickOutSide>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { Alert } from 'ant-design-vue';
  import ClickOutSide from '/@/components/ClickOutSide/index.vue';
  export default defineComponent({
    components: { ClickOutSide, Alert },
    setup() {
      const text = ref('Click');
      function handleClickOutside() {
        text.value = 'Click Out Side';
      }

      function innerClick() {
        text.value = 'Click Inner';
      }
      return { innerClick, handleClickOutside, text };
    },
  });
</script>

<style lang="less" scoped>
  .demo-box {
    display: flex;
    width: 100%;
    height: 300px;
    font-size: 24px;
    color: #fff;
    background: #408ede;
    border-radius: 10px;
    justify-content: center;
    align-items: center;
  }
</style>
