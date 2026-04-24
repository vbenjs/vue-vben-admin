import type { Watermark, WatermarkOptions } from 'watermark-js-plus';

import { nextTick, onUnmounted, readonly, ref, watch } from 'vue';

import { usePreferences } from '@vben/preferences';

const watermark = ref<Watermark>();
const unmountedHooked = ref<boolean>(false);
const themeWatcherHooked = ref<boolean>(false);

function getDefaultWatermarkColor(isDark: boolean): string {
  return isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)';
}

function getDefaultOptions(isDark: boolean): Partial<WatermarkOptions> {
  const color = getDefaultWatermarkColor(isDark);
  return {
    advancedStyle: {
      colorStops: [
        {
          color,
          offset: 0,
        },
        {
          color,
          offset: 1,
        },
      ],
      type: 'linear',
    },
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
  };
}

const cachedOptions = ref<Partial<WatermarkOptions>>({});

export function useWatermark() {
  const { isDark } = usePreferences();

  function mergeOptionsWithTheme(
    options: Partial<WatermarkOptions>,
    isDarkValue: boolean,
  ): Partial<WatermarkOptions> {
    const defaultOpts = getDefaultOptions(isDarkValue);

    if (options.advancedStyle?.colorStops) {
      return {
        ...defaultOpts,
        ...cachedOptions.value,
        ...options,
      };
    }

    return {
      ...defaultOpts,
      ...cachedOptions.value,
      ...options,
      advancedStyle: {
        ...defaultOpts.advancedStyle,
        ...cachedOptions.value?.advancedStyle,
        ...options?.advancedStyle,
        colorStops: defaultOpts.advancedStyle?.colorStops,
      },
    };
  }

  async function initWatermark(options: Partial<WatermarkOptions>) {
    const { Watermark } = await import('watermark-js-plus');

    cachedOptions.value = {
      ...cachedOptions.value,
      ...options,
    };

    const mergedOptions = mergeOptionsWithTheme(options, isDark.value);
    watermark.value = new Watermark(mergedOptions);
    await watermark.value?.create();
  }

  async function updateWatermark(options: Partial<WatermarkOptions>) {
    if (watermark.value) {
      await nextTick();

      cachedOptions.value = {
        ...cachedOptions.value,
        ...options,
      };

      const mergedOptions = mergeOptionsWithTheme(options, isDark.value);
      await watermark.value?.changeOptions(mergedOptions);
    } else {
      await initWatermark(options);
    }
  }

  function destroyWatermark() {
    if (watermark.value) {
      watermark.value.destroy();
      watermark.value = undefined;
    }
  }

  if (!themeWatcherHooked.value) {
    themeWatcherHooked.value = true;

    watch(
      () => isDark.value,
      () => {
        if (watermark.value) {
          const mergedOptions = mergeOptionsWithTheme(
            cachedOptions.value,
            isDark.value,
          );
          watermark.value.changeOptions(mergedOptions);
        }
      },
    );
  }

  if (!unmountedHooked.value) {
    unmountedHooked.value = true;
    onUnmounted(() => {
      destroyWatermark();
    });
  }

  return {
    destroyWatermark,
    updateWatermark,
    watermark: readonly(watermark),
  };
}
