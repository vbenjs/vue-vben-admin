import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import { preferences } from '@vben/preferences';

/**
 * 内容切换 loading：
 * - 延迟显示：导航在 showDelay 内完成时不渲染 spinner，
 *   避免快速跳转时闪现半遮罩造成卡顿感（issue #8289）；
 * - 最小展示：spinner 一旦显示，至少保留 minShowTime，避免一闪而过。
 */
function useContentSpinner() {
  const spinning = ref(false);
  const startTime = ref(0);
  const router = useRouter();
  const showDelay = 200; // 延迟显示时间：更快的导航不显示 loading
  const minShowTime = 500; // 最小显示时间
  const enableLoading = computed(() => preferences.transition.loading);

  let hideTimer: null | ReturnType<typeof setTimeout> = null;
  let navSeq = 0;
  const routeSeq = new WeakMap<object, number>();
  let showTimer: null | {
    id: ReturnType<typeof setTimeout>;
    seq: number;
  } = null;

  const clearTimers = () => {
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }
    if (showTimer) {
      clearTimeout(showTimer.id);
      showTimer = null;
    }
  };

  // 结束加载动画
  const onEnd = (seq: number | undefined) => {
    if (!enableLoading.value || seq !== navSeq) {
      return;
    }
    if (showTimer?.seq === seq) {
      clearTimeout(showTimer.id);
      showTimer = null;
    }
    // spinner 尚未显示过（快速导航）：直接结束，不闪现
    if (!spinning.value) {
      return;
    }
    const processTime = performance.now() - startTime.value;
    if (processTime < minShowTime) {
      hideTimer = setTimeout(() => {
        hideTimer = null;
        spinning.value = false;
      }, minShowTime - processTime);
    } else {
      spinning.value = false;
    }
  };

  // 路由前置守卫
  router.beforeEach((to) => {
    if (to.meta.loaded || !enableLoading.value || to.meta.iframeSrc) {
      return true;
    }
    clearTimers();
    navSeq += 1;
    const seq = navSeq;
    routeSeq.set(to, seq);
    const id = setTimeout(() => {
      if (showTimer?.seq === seq) {
        showTimer = null;
      }
      // 仅当仍是本次导航时才显示，避免陈旧定时器闪现
      if (seq === navSeq && !spinning.value) {
        startTime.value = performance.now();
        spinning.value = true;
      }
    }, showDelay);
    showTimer = { id, seq };
    return true;
  });

  // 路由后置守卫
  router.afterEach((to) => {
    if (to.meta.loaded || !enableLoading.value || to.meta.iframeSrc) {
      return true;
    }
    onEnd(routeSeq.get(to));
    return true;
  });

  return { spinning };
}

export { useContentSpinner };
