<script lang="ts" setup>
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
  minLoadingTime: 50,
});
// const startTime = ref(0);
const showSpinner = ref(false);
const renderSpinner = ref(true);
const timer = ref<ReturnType<typeof setTimeout>>();

watch(
  () => props.spinning,
  (show) => {
    if (!show) {
      showSpinner.value = false;
      clearTimeout(timer.value);
      return;
    }

    // startTime.value = performance.now();
    timer.value = setTimeout(() => {
      // const loadingTime = performance.now() - startTime.value;

      showSpinner.value = true;
      if (showSpinner.value) {
        renderSpinner.value = true;
      }
    }, props.minLoadingTime);
  },
  {
    immediate: true,
  },
);

function onTransitionEnd() {
  if (!showSpinner.value) {
    renderSpinner.value = false;
  }
}
</script>

<template>
  <div
    :class="{
      'invisible opacity-0': !showSpinner,
    }"
    class="flex-center bg-overlay z-100 absolute left-0 top-0 size-full backdrop-blur-sm transition-all duration-500"
    @transitionend="onTransitionEnd"
  >
    <div
      class="loader before:bg-primary/50 after:bg-primary relative h-12 w-12 before:absolute before:left-0 before:top-[60px] before:h-[5px] before:w-12 before:animate-[loader-shadow-ani_0.5s_linear_infinite] before:rounded-[50%] before:content-[''] after:absolute after:left-0 after:top-0 after:h-full after:w-full after:animate-[loader-jump-ani_0.5s_linear_infinite] after:rounded after:content-['']"
    ></div>
  </div>
</template>

<style>
@keyframes loader-jump-ani {
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

@keyframes loader-shadow-ani {
  0%,
  100% {
    transform: scale(1, 1);
  }

  50% {
    transform: scale(1.2, 1);
  }
}
</style>
