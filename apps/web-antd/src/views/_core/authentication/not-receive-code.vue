<script lang="ts" setup>
import { onMounted } from 'vue';

// const emit = defineEmits(['blur', 'change']);
import { Button } from 'ant-design-vue';

defineOptions({ name: 'NotReceiveCode', components: { AButton: Button } });

const handleClick = () => {
  console.warn('Button clicked');
};

onMounted(() => {
  console.error('NotReceiveCode component mounted');
});
</script>
<template>
  <div class="-mb-1 -mt-1 flex w-full justify-end gap-1">
    <a-button class="not-receive-wrapper" type="text" @click="handleClick">
      收不到验证码？
    </a-button>
  </div>
</template>
<style scoped lang="scss">
.not-receive-wrapper {
  height: auto;
  padding: 0;
  font-size: 14px;
  color: hsl(227deg 13% 57%);
  cursor: pointer;

  &:hover {
    background-color: unset;
  }
}
</style>
