<template>
  <div ref="wrap">
    <slot></slot>
  </div>
</template>
<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { onClickOutside } from '@vben/hooks';

  const emit = defineEmits(['mounted', 'clickOutside']);
  const wrap = ref(null);

  onClickOutside(wrap, () => {
    emit('clickOutside');
  });

  onMounted(() => {
    emit('mounted');
  });
</script>
