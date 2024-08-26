<script lang="ts" setup>
defineOptions({
  name: 'PopconfirmButton',
});
defineProps<{
  buttonProps?: any;
  confirmProps?: any;
}>();
const emits = defineEmits(['submit', 'cancel']);
</script>

<template>
  <NPopconfirm
    v-bind="$attrs"
    @negative-click="emits('cancel')"
    @positive-click="emits('submit')"
  >
    <template #trigger>
      <NButton v-bind="buttonProps">
        <slot name="triggerLabel">删除</slot>
      </NButton>
    </template>
    <template #default>
      <slot name="default">确认删除？</slot>
    </template>
  </NPopconfirm>
</template>

<style scoped></style>
