import { onMounted, onUnmounted } from 'compatible-vue';

/**
 * @description: 刷新页面确认
 */
export function usePageRedoConfirm(): void {
  onMounted(() => {
    window.onbeforeunload = function (e: BeforeUnloadEvent) {
      e = e || window.event;
      // 兼容IE8和Firefox 4之前的版本
      if (e) {
        e.returnValue = '关闭提示';
      }
      return '关闭提示';
    };
  });

  onUnmounted(() => {
    window.onbeforeunload = null;
  });
}
