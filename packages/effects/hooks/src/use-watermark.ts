import type { Watermark, WatermarkOptions } from 'watermark-js-plus';

import { nextTick, onUnmounted, ref, watch } from 'vue';

import { preferences } from '@vben/preferences';

const watermark = ref<Watermark>();
const cachedOptions = ref<Partial<WatermarkOptions>>({
  advancedStyle: {
    colorStops: [
      {
        color: 'gray',
        offset: 0,
      },
      {
        color: 'gray',
        offset: 1,
      },
    ],
    type: 'linear',
  },
  // fontSize: '20px',
  content: '',
  contentType: 'multi-line-text',
  globalAlpha: 0.25,
  gridLayoutOptions: {
    cols: 2,
    gap: [20, 20],
    matrix: [
      [1, 0],
      [0, 1],
    ],
    rows: 2,
  },
  height: 200,
  layout: 'grid',
  rotate: 30,
  width: 160,
});

export function useWatermark() {
  async function initWatermark(options: Partial<WatermarkOptions>) {
    const { Watermark } = await import('watermark-js-plus');

    cachedOptions.value = {
      ...cachedOptions.value,
      ...options,
    };
    watermark.value = new Watermark(cachedOptions.value);

    watermark.value?.create();
  }

  async function updateWatermark(options: Partial<WatermarkOptions>) {
    if (!watermark.value || !watermark.value?.check()) {
      await initWatermark(options);
    } else {
      await nextTick();
      watermark.value?.changeOptions({
        ...cachedOptions.value,
        ...options,
      });
    }
  }

  function destroyWatermark() {
    watermark.value?.destroy();
  }

  watch(
    () => preferences.app.watermark,
    (enable) => {
      if (!enable) {
        destroyWatermark();
      }
    },
  );

  onUnmounted(() => {
    destroyWatermark();
  });

  return {
    destroyWatermark,
    updateWatermark,
    watermark,
  };
}
