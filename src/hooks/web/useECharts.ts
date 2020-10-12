import { useTimeout } from '/@/hooks/core/useTimeout';
import { tryOnUnmounted } from '/@/utils/helper/vueHelper';
import { ref, unref, Ref, nextTick } from 'vue';
import type { EChartOption, ECharts } from 'echarts';
import echarts from 'echarts';
import { useDebounce } from '/@/hooks/core/useDebounce';
import { useEvent } from '/@/hooks/event/useEvent';
import { useBreakpoint } from '/@/hooks/event/useBreakpoint';

export type { EChartOption, ECharts };
export function useECharts(
  elRef: Ref<HTMLDivElement>,
  theme: 'light' | 'dark' | 'default' = 'light'
) {
  const chartInstanceRef = ref<Nullable<ECharts>>(null);
  let resizeFn: Fn = resize;

  const [debounceResize] = useDebounce(resize, 200);
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
    });
    const { widthRef, screenEnum } = useBreakpoint();
    if (unref(widthRef) <= screenEnum.MD) {
      useTimeout(() => {
        resizeFn();
      }, 30);
    }
  }

  function setOptions(options: any, clear = true) {
    nextTick(() => {
      useTimeout(() => {
        let chartInstance = unref(chartInstanceRef);

        if (!chartInstance) {
          init();
          chartInstance = chartInstance = unref(chartInstanceRef);
          if (!chartInstance) {
            return;
          }
        }
        clear && chartInstance.clear();

        chartInstance && chartInstance.setOption(options);
      }, 30);
    });
  }

  function resize() {
    const chartInstance = unref(chartInstanceRef);
    if (!chartInstance) return;
    chartInstance.resize();
  }

  tryOnUnmounted(() => {
    const chartInstance = unref(chartInstanceRef);
    if (!chartInstance) return;
    chartInstance.dispose();
    chartInstanceRef.value = null;
  });

  return {
    setOptions,
    echarts,
  };
}
