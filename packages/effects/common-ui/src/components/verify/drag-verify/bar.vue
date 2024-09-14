<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps<{
  toLeft: boolean;
}>();
const divRef = ref<HTMLDivElement>();
const width = ref('0px');
const cls = computed(() => {
  return {
    'drag-verify-bar': true,
    'to-left': props.toLeft,
  };
});

defineExpose({
  getEl: () => {
    return divRef.value;
  },
  setWidth: (val: string) => {
    width.value = val;
  },
});
</script>

<template>
  <div ref="divRef" :class="cls" :style="{ width }"></div>
</template>

<style scoped></style>
