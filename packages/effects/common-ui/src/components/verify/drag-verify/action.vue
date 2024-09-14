<script setup lang="ts">
import { computed, type CSSProperties, ref } from 'vue';

const props = defineProps<{
  actionStyle: CSSProperties;
  height: number | string;
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
const style = computed(() => {
  const { actionStyle, height } = props;
  const h = `${Number.parseInt(height as string)}px`;
  return {
    height: h,
    left: left.value,
    width: h,
    ...actionStyle,
  };
});

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
  <div ref="divRef" :class="cls" :style="style">
    {{ left }}
  </div>
</template>

<style scoped></style>
