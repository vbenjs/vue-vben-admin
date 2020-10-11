import { useTimeout } from '/@/hooks/core/useTimeout';
import { tryOnUnmounted } from '/@/utils/helper/vueHelper';
import { ref, unref, Ref, nextTick } from 'vue';

import ApexCharts from 'apexcharts';

export function useApexCharts(elRef: Ref<HTMLDivElement>) {
  const chartInstanceRef = ref<Nullable<ApexCharts>>(null);

  function setOptions(options: any) {
    const el = unref(elRef);

    if (!el || !unref(el)) {
      return;
    }
    chartInstanceRef.value = new ApexCharts(el, options);

    const chartInstance = unref(chartInstanceRef);

    nextTick(() => {
      useTimeout(() => {
        chartInstance && chartInstance.render();
      }, 30);
    });
  }

  tryOnUnmounted(() => {
    const chartInstance = unref(chartInstanceRef);
    if (!chartInstance) {
      return;
    }
    chartInstanceRef.value = null;
  });
  return {
    setOptions,
  };
}
