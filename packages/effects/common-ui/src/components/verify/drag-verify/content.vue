<script setup lang="ts">
import { computed, type CSSProperties, ref } from 'vue';

const props = defineProps<{
  contentStyle: CSSProperties;
  height: number | string;
  isPassing: boolean;
  successText: string;
  text: string;
  width: number | string;
}>();

const cls = computed(() => {
  return {
    'drag-verify-content': true,
    success: props.isPassing,
  };
});

const divRef = ref<HTMLDivElement>();

const style = computed(() => {
  const { contentStyle, height, width } = props;
  const h = `${Number.parseInt(height as string)}px`;
  const w = `${Number.parseInt(width as string)}px`;

  return {
    height: h,
    width: w,
    ...contentStyle,
  };
});

defineExpose({
  getEl: () => {
    return divRef.value;
  },
});
</script>

<template>
  <div ref="divRef" :class="cls" :style="style">
    {{ isPassing ? successText : text }}
  </div>
</template>

<style scoped></style>
