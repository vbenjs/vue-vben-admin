import { useTimeoutFn } from '/@/hooks/core/useTimeout';
import { tryOnUnmounted } from '/@/utils/helper/vueHelper';
import { unref, Ref, nextTick } from 'vue';

import ApexCharts from 'apexcharts';

interface CallBackFn {
  (instance: Nullable<ApexCharts>): void;
}

export function useApexCharts(elRef: Ref<HTMLDivElement>) {
  let chartInstance: Nullable<ApexCharts> = null;

  function setOptions(options: any, callback?: CallBackFn) {
    nextTick(() => {
      useTimeoutFn(() => {
        const el = unref(elRef);

        if (!el || !unref(el)) return;
        chartInstance = new ApexCharts(el, options);

        chartInstance && chartInstance.render();

        // setOptions增加callback方法，返回chartInstance，以便于对图表进行再操作，例如调用updateOptions方法更新图表
        callback && callback(chartInstance);
      }, 30);
    });
  }

  // 新增调用ApexCharts的updateOptions方法更新图表
  function updateOptions(
    chartInstance: Nullable<ApexCharts>,
    options: any,
    redraw = false,
    animate = true,
    updateSyncedCharts = true,
    callback: CallBackFn
  ) {
    nextTick(() => {
      useTimeoutFn(() => {
        chartInstance && chartInstance.updateOptions(options, redraw, animate, updateSyncedCharts);

        callback && callback(chartInstance);
      }, 30);
    });
  }

  tryOnUnmounted(() => {
    if (!chartInstance) return;
    chartInstance?.destroy?.();
    chartInstance = null;
  });

  return {
    setOptions,
    updateOptions,
  };
}
