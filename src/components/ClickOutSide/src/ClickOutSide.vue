<template>
  <div ref="wrap">
    <slot></slot>
  </div>
</template>
<script lang="ts" setup>
  import { onClickOutside } from '@vueuse/core';
  import { onMounted, ref } from 'vue';

  const emit = defineEmits(['mounted', 'clickOutside']);
  const wrap = ref(null);

  onClickOutside(wrap, () => {
    emit('clickOutside');
  });

  onMounted(() => {
    emit('mounted');
  });
</script>
