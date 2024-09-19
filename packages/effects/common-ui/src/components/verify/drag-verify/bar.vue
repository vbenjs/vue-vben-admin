<script setup lang="ts">
import { computed, type CSSProperties, ref } from 'vue';

const props = defineProps<{
  barStyle: CSSProperties;
  circle: boolean;
  height: number | string;
  toLeft: boolean;
}>();
const divRef = ref<HTMLDivElement>();
const width = ref('0px');

const style = computed(() => {
  const { barStyle, circle, height } = props;
  const h = Number.parseInt(height as string);
  return {
    background: 'hsl(var(--success))',
    borderRadius: circle ? `${h / 2}px 0 0 ${h / 2}px` : 0,
    height: `${h}px`,
    ...barStyle,
    width: width.value,
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
  <div
    ref="divRef"
    :class="props.toLeft ? 'transition-width !w-0 duration-300' : ''"
    :style="style"
    class="absolute h-9 w-0 rounded-md"
  ></div>
</template>

<style scoped></style>
