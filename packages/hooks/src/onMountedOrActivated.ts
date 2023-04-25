import { type AnyFunction } from '@vben/types';
import { nextTick, onActivated, onMounted } from 'vue';

/**
 * 在 OnMounted 或者 OnActivated 时触发
 * @param hook 任何函数（包括异步函数）
 */
function onMountedOrActivated(hook: AnyFunction) {
  let mounted: boolean;

  onMounted(() => {
    hook();
    nextTick(() => {
      mounted = true;
    });
  });

  onActivated(() => {
    if (mounted) {
      hook();
    }
  });
}

export { onMountedOrActivated };
