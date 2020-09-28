<template>
  <div class="px-64">
    <Alert message="点内外部触发事件" show-icon class="mt-4"></Alert>
    <ClickOutSide @clickOutside="handleClickOutside" class="flex justify-center mt-10">
      <div
        @click="innerClick"
        class="bg-primary w-full h-64 flex justify-center items-center text-2xl text-white rounded-lg shadow-lg"
      >
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
