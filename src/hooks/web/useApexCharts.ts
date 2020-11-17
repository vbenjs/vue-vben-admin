import { useTimeoutFn } from '@vueuse/core';
import { tryOnUnmounted } from '/@/utils/helper/vueHelper';
import { unref, Ref, nextTick } from 'vue';

import ApexCharts from 'apexcharts';

export function useApexCharts(elRef: Ref<HTMLDivElement>) {
  let chartInstance: Nullable<ApexCharts> = null;

  function setOptions(options: any) {
    nextTick(() => {
      useTimeoutFn(() => {
        const el = unref(elRef);

        if (!el || !unref(el)) return;
        chartInstance = new ApexCharts(el, options);

        chartInstance && chartInstance.render();
      }, 30);
    });
  }

  tryOnUnmounted(() => {
    if (!chartInstance) return;
    chartInstance.destroy();
    chartInstance = null;
  });

  return {
    setOptions,
  };
}
