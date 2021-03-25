import { useTimeoutFn } from '/@/hooks/core/useTimeout';
import { unref, Ref, nextTick } from 'vue';
import { tryOnUnmounted } from '@vueuse/core';

interface CallBackFn {
  (instance: Nullable<ApexCharts>): void;
}

export function useApexCharts(elRef: Ref<HTMLDivElement>) {
  let chartInstance: Nullable<ApexCharts> = null;

  function setOptions(options: any, callback?: CallBackFn) {
    nextTick(() => {
      useTimeoutFn(async () => {
        const el = unref(elRef);

        if (!el || !unref(el)) return;
        const ApexCharts = await (await import('apexcharts')).default;
        chartInstance = new ApexCharts(el, options);

        chartInstance && chartInstance.render();

        // The callback method is added to setOptions to return the chartInstance to facilitate the re-operation of the chart, such as calling the updateOptions method to update the chart
        callback && callback(chartInstance);
      }, 30);
    });
  }

  // Call the updateOptions method of ApexCharts to update the chart
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
