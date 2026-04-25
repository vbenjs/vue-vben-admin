import type { Watermark, WatermarkOptions } from 'watermark-js-plus';

import { nextTick, onUnmounted, readonly, ref } from 'vue';

const watermark = ref<Watermark>();
const mutationObserver = ref<MutationObserver>();
const isWatermarkEnabled = ref<boolean>(false);
const activeInstances = ref<number>(0);

const CSS_VAR_FOREGROUND = '--foreground';

function getForegroundColorFromCSS(): string {
  try {
    const computedStyle = getComputedStyle(document.documentElement);
    const foregroundValue = computedStyle.getPropertyValue(CSS_VAR_FOREGROUND).trim();
    
    if (foregroundValue) {
      return `hsl(${foregroundValue})`;
    }
  } catch (e) {
    console.warn('Failed to get CSS variable for watermark color:', e);
  }
  
  return 'hsl(0 0% 50%)';
}

function getColorStops(): { color: string; offset: number }[] {
  const color = getForegroundColorFromCSS();
  return [
    { color, offset: 0 },
    { color, offset: 1 },
  ];
}

function createBaseOptions(
  content: string,
  globalAlpha: number,
): Partial<WatermarkOptions> {
  return {
    advancedStyle: {
      colorStops: getColorStops(),
      type: 'linear',
    },
    content,
    contentType: 'multi-line-text',
    globalAlpha,
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
    mutationObserver.value = undefined;
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

function cleanupMutationObserver() {
  if (mutationObserver.value) {
    mutationObserver.value.disconnect();
    mutationObserver.value = undefined;
  }
}

async function recreateWatermark() {
  if (!isWatermarkEnabled.value) return;

  try {
    if (watermark.value) {
      watermark.value.destroy();
      watermark.value = undefined;
    }

    await nextTick();
  } catch (e) {
    console.error('Failed to recreate watermark:', e);
  }
}

export function useWatermark() {
  activeInstances.value++;

  async function initWatermark(options: Partial<WatermarkOptions>) {
    const { Watermark } = await import('watermark-js-plus');

    const mergedOptions = {
      ...createBaseOptions(
        (options.content as string) || '',
        options.globalAlpha ?? 0.25,
      ),
      ...options,
    };

    watermark.value = new Watermark(mergedOptions);
    await watermark.value?.create();

    isWatermarkEnabled.value = true;
    setupMutationObserver();
  }

  async function updateWatermark(options: Partial<WatermarkOptions>) {
    const content = (options.content as string) || '';
    const globalAlpha = options.globalAlpha ?? 0.25;

    const mergedOptions = createBaseOptions(content, globalAlpha);

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

    cleanupMutationObserver();

    if (watermark.value) {
      watermark.value.destroy();
      watermark.value = undefined;
    }
  }

  function cleanup() {
    activeInstances.value--;
    
    if (activeInstances.value <= 0) {
      destroyWatermark();
      activeInstances.value = 0;
    }
  }

  onUnmounted(() => {
    cleanup();
  });

  return {
    destroyWatermark,
    updateWatermark,
    watermark: readonly(watermark),
  };
}
