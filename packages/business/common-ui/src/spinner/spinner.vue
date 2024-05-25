<script lang="ts" setup>
import type { TimeoutHandle } from '@vben/types';

import { ref, watch } from 'vue';

interface Props {
  /**
   * @zh_CN 最小加载时间
   * @en_US Minimum loading time
   */
  minLoadingTime?: number;
  /**
   * @zh_CN loading状态开启
   */
  spinning?: boolean;
}

defineOptions({
  name: 'Spinner',
});

const props = withDefaults(defineProps<Props>(), {
  minLoadingTime: 200,
});
const startTime = ref(0);
const endTime = ref(0);
const showSpinner = ref(false);
const timer = ref<TimeoutHandle>();

watch(
  () => props.spinning,
  (show) => {
    if (!show) {
      showSpinner.value = false;
      clearTimeout(timer.value);
      return;
    }
    startTime.value = performance.now();
    timer.value = setTimeout(() => {
      endTime.value = performance.now();

      const loadingTime = endTime.value - startTime.value;

      showSpinner.value = loadingTime > props.minLoadingTime;
    }, props.minLoadingTime);
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <div
    v-if="showSpinner"
    class="flex-center bg-overlay absolute left-0 top-0 size-full backdrop-blur-sm"
  >
    <div class="loader relative h-12 w-12"></div>
  </div>
</template>

<style lang="scss" scoped>
@import '@vben-core/design/global';

@keyframes jump-ani {
  15% {
    border-bottom-right-radius: 3px;
  }

  25% {
    transform: translateY(9px) rotate(22.5deg);
  }

  50% {
    border-bottom-right-radius: 40px;
    transform: translateY(18px) scale(1, 0.9) rotate(45deg);
  }

  75% {
    transform: translateY(9px) rotate(67.5deg);
  }

  100% {
    transform: translateY(0) rotate(90deg);
  }
}

@keyframes shadow-ani {
  0%,
  100% {
    transform: scale(1, 1);
  }

  50% {
    transform: scale(1.2, 1);
  }
}

.loader {
  &::before {
    @apply bg-primary/50 absolute left-0 top-[60px] h-[5px] w-12 animate-[shadow-ani_0.5s_linear_infinite] rounded-[50%] content-[''];
  }

  &::after {
    @apply bg-primary absolute left-0 top-0 h-full w-full animate-[jump-ani_0.5s_linear_infinite] rounded content-[''];
  }
}
</style>
