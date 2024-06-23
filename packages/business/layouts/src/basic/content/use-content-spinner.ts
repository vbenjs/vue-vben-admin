import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import { preferences } from '@vben-core/preferences';

function useContentSpinner() {
  const spinning = ref(false);
  const isStartTransition = ref(false);
  const startTime = ref(0);
  const router = useRouter();
  const minShowTime = 500;
  const enableLoading = computed(() => preferences.transition.loading);

  const onEnd = () => {
    if (!enableLoading.value) {
      return;
    }
    const processTime = performance.now() - startTime.value;
    if (processTime < minShowTime) {
      setTimeout(() => {
        spinning.value = false;
      }, minShowTime - processTime);
    } else {
      spinning.value = false;
    }
  };

  router.beforeEach((to) => {
    if (to.meta.loaded || !enableLoading.value) {
      return true;
    }
    isStartTransition.value = false;
    startTime.value = performance.now();
    spinning.value = true;
    return true;
  });

  router.afterEach((to) => {
    if (to.meta.loaded || !enableLoading.value) {
      return true;
    }

    // 未进入过渡动画
    if (!isStartTransition.value) {
      // 关闭加载动画
      onEnd();
    }

    isStartTransition.value = false;
    return true;
  });

  return { onTransitionEnd: onEnd, spinning };
}

export { useContentSpinner };
