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
  <div
    ref="divRef"
    :class="{
      [$style.content]: true,
      [$style.success]: isPassing,
      [$style.default]: !isPassing,
    }"
    :style="style"
    class="absolute top-0 flex select-none items-center justify-center text-xs"
  >
    <slot v-if="$slots.text" name="text"></slot>
    <template v-else>
      {{ isPassing ? successText : text }}
    </template>
  </div>
</template>

<style module>
@keyframes slidetounlock {
  0% {
    background-position: -120px 0;
  }

  100% {
    background-position: 120px 0;
  }
}

.content {
  background-clip: text;
  animation: slidetounlock 3s infinite;
  text-size-adjust: none;
}

.success {
  -webkit-text-fill-color: white;
}

.default {
  -webkit-text-fill-color: #333;
}
</style>
