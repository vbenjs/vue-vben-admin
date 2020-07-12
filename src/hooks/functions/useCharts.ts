import { ref, unref, onUnmounted, Ref, nextTick } from 'compatible-vue';
import { EChartOption, ECharts } from 'echarts';
import echarts from '@/common/libs/echarts';
import { useDebounce } from '@/hooks/core/useDebounce';
import { useEvent } from '@/hooks/event/useEvent';
import { useBreakpoint } from '@/hooks/event/useBreakpoint';

export { EChartOption, ECharts };
export function useCharts(
  elRef: Ref<HTMLDivElement>,
  theme: 'light' | 'dark' | 'default' = 'light'
) {
  const chartInstanceRef = ref<ECharts | null>(null);
  let resizeFn: Fn = resize;

  const [debounceResize] = useDebounce(resize, 200);
  const { widthRef, screenEnum } = useBreakpoint();
  resizeFn = debounceResize;

  function init() {
    const el = unref(elRef);

    if (!el || !unref(el)) {
      return;
    }
    chartInstanceRef.value = echarts.init(el, theme);
    useEvent({
      el: window,
      name: 'resize',
      listener: resizeFn,
      autoRemove: true,
    });
    if (unref(widthRef) <= screenEnum.MD) {
      setTimeout(() => {
        resizeFn();
      }, 0);
    }
  }

  function setOptions(options: EChartOption, clear = true) {
    let chartInstance = unref(chartInstanceRef);

    if (!chartInstance) {
      init();
      chartInstance = chartInstance = unref(chartInstanceRef);
      if (!chartInstance) {
        return;
      }
    }
    clear && chartInstance.clear();
    nextTick(() => {
      chartInstance!.setOption(options);
    });
  }

  function resize() {
    const chartInstance = unref(chartInstanceRef);
    if (!chartInstance) {
      return;
    }
    chartInstance.resize();
  }
  onUnmounted(() => {
    const chartInstance = unref(chartInstanceRef);
    if (!chartInstance) {
      return;
    }
    chartInstance.dispose();
    chartInstanceRef.value = null;
  });
  return {
    setOptions,
    echarts,
  };
}
