import type { Watermark, WatermarkOptions } from 'watermark-js-plus';

import { nextTick, onUnmounted, readonly, ref, watch } from 'vue';

const watermark = ref<Watermark>();
const unmountedHooked = ref<boolean>(false);
const mutationObserver = ref<MutationObserver>();
const isWatermarkEnabled = ref<boolean>(false);

const DEFAULT_DARK_COLOR = 'rgba(255, 255, 255, 0.8)';
const DEFAULT_LIGHT_COLOR = 'rgba(0, 0, 0, 0.8)';

interface WatermarkConfig {
  content: string;
  globalAlpha: number;
  isDark: boolean;
}

const currentConfig = ref<WatermarkConfig>({
  content: '',
  globalAlpha: 0.25,
  isDark: false,
});

function getColorStops(isDark: boolean): { color: string; offset: number }[] {
  const color = isDark ? DEFAULT_DARK_COLOR : DEFAULT_LIGHT_COLOR;
  return [
    { color, offset: 0 },
    { color, offset: 1 },
  ];
}

function createBaseOptions(config: WatermarkConfig): Partial<WatermarkOptions> {
  return {
    advancedStyle: {
      colorStops: getColorStops(config.isDark),
      type: 'linear',
    },
    content: config.content,
    contentType: 'multi-line-text',
    globalAlpha: config.globalAlpha,
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

function setupMutationObserver() {
  if (mutationObserver.value) {
    mutationObserver.value.disconnect();
  }

  const observer = new MutationObserver((mutations) => {
    if (!isWatermarkEnabled.value || !watermark.value) return;

    let shouldRecreate = false;

    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        const removedNodes = Array.from(mutation.removedNodes);
        for (const node of removedNodes) {
          if (
            node instanceof HTMLElement &&
            (node.classList.contains('watermark-container') ||
              node.classList.contains('watermark-item'))
          ) {
            shouldRecreate = true;
            break;
          }
        }
      } else if (mutation.type === 'attributes') {
        const target = mutation.target as HTMLElement;
        if (
          target.classList.contains('watermark-container') ||
          target.classList.contains('watermark-item')
        ) {
          if (mutation.attributeName === 'style') {
            const style = target.getAttribute('style') || '';
            if (
              style.includes('display: none') ||
              style.includes('visibility: hidden') ||
              style.includes('opacity: 0') ||
              style.includes('z-index: -1')
            ) {
              shouldRecreate = true;
            }
          } else if (mutation.attributeName === 'class') {
            if (
              target.classList.contains('hidden') ||
              target.classList.contains('invisible')
            ) {
              shouldRecreate = true;
            }
          }
        }
      }
    }

    if (shouldRecreate) {
      recreateWatermark();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class'],
  });

  mutationObserver.value = observer;
}

async function recreateWatermark() {
  if (!isWatermarkEnabled.value) return;

  try {
    if (watermark.value) {
      watermark.value.destroy();
      watermark.value = undefined;
    }

    await nextTick();

    const options = createBaseOptions(currentConfig.value);
    const { Watermark } = await import('watermark-js-plus');
    watermark.value = new Watermark(options);
    await watermark.value?.create();
  } catch (e) {
    console.error('Failed to recreate watermark:', e);
  }
}

export function useWatermark() {
  async function initWatermark(options: Partial<WatermarkOptions>) {
    const { Watermark } = await import('watermark-js-plus');

    const mergedOptions = {
      ...createBaseOptions(currentConfig.value),
      ...options,
    };

    watermark.value = new Watermark(mergedOptions);
    await watermark.value?.create();

    isWatermarkEnabled.value = true;
    setupMutationObserver();
  }

  async function updateWatermark(options: Partial<WatermarkOptions> & { isDark?: boolean }) {
    if (options.isDark !== undefined) {
      currentConfig.value.isDark = options.isDark;
    }
    if (options.content !== undefined) {
      currentConfig.value.content = options.content;
    }
    if (options.globalAlpha !== undefined) {
      currentConfig.value.globalAlpha = options.globalAlpha;
    }

    const mergedOptions = createBaseOptions(currentConfig.value);

    if (watermark.value) {
      await nextTick();
      await watermark.value?.changeOptions(mergedOptions);
    } else {
      await initWatermark(mergedOptions);
    }

    isWatermarkEnabled.value = true;
  }

  function destroyWatermark() {
    isWatermarkEnabled.value = false;

    if (mutationObserver.value) {
      mutationObserver.value.disconnect();
      mutationObserver.value = undefined;
    }

    if (watermark.value) {
      watermark.value.destroy();
      watermark.value = undefined;
    }
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
