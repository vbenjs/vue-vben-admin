<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps<{
  isPassing: boolean;
  toLeft: boolean;
}>();
const divRef = ref<HTMLDivElement>();
const cls = computed(() => {
  return {
    'darg-verify-action': true,
    'to-left': props.toLeft,
  };
});
const left = ref('0px');

defineExpose({
  getEl: () => {
    return divRef.value;
  },
  getStyle: () => {
    return divRef.value && divRef.value && divRef.value.style;
  },
  setLeft: (val: string) => {
    left.value = val;
  },
});
</script>

<template>
  <div ref="divRef" :class="cls" :style="{ left }">cc</div>
</template>

<style scoped></style>
