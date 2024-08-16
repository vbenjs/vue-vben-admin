<script setup lang="ts">
import type { Sortable } from '@vben-core/composables';
import type { TabDefinition } from '@vben-core/typings';

import type { TabsProps } from './types';

import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

import { useForwardPropsEmits, useSortable } from '@vben-core/composables';
import { ChevronLeft, ChevronRight } from '@vben-core/icons';

import { Tabs, TabsChrome } from './components';
import { useTabsViewScroll } from './use-tabs-view-scroll';

interface Props extends TabsProps {}

defineOptions({
  name: 'TabsView',
});

const props = withDefaults(defineProps<Props>(), {
  contentClass: 'vben-tabs-content',
  dragable: true,
  styleType: 'chrome',
});

const emit = defineEmits<{
  close: [string];
  sortTabs: [number, number];
  unpin: [TabDefinition];
}>();

const forward = useForwardPropsEmits(props, emit);

const { initScrollbar, scrollDirection } = useTabsViewScroll();

const sortableInstance = ref<null | Sortable>(null);

// 可能会找到拖拽的子元素，这里需要确保拖拽的dom时tab元素
function findParentElement(element: HTMLElement) {
  const parentCls = 'group';
  return element.classList.contains(parentCls)
    ? element
    : element.closest(`.${parentCls}`);
}

async function initTabsSortable() {
  await nextTick();
  const { contentClass } = props;

  const el = document.querySelectorAll(`.${contentClass}`)?.[0] as HTMLElement;

  const resetElState = () => {
    el.style.cursor = 'default';
    el.classList.remove('dragging');
  };

  const { initializeSortable } = useSortable(el, {
    filter: (_evt, target: HTMLElement) => {
      const parent = findParentElement(target);
      const dragable = parent?.classList.contains('dragable');
      return !dragable || !props.dragable;
    },
    onEnd(evt) {
      const { newIndex, oldIndex } = evt;
      // const fromElement = evt.item;
      const { srcElement } = (evt as any).originalEvent;

      if (!srcElement) {
        resetElState();
        return;
      }

      const srcParent = findParentElement(srcElement);

      if (!srcParent) {
        resetElState();
        return;
      }

      if (!srcParent.classList.contains('dragable')) {
        resetElState();

        return;
      }

      if (
        oldIndex !== undefined &&
        newIndex !== undefined &&
        !Number.isNaN(oldIndex) &&
        !Number.isNaN(newIndex) &&
        oldIndex !== newIndex
      ) {
        emit('sortTabs', oldIndex, newIndex);
      }
      resetElState();
    },
    onMove(evt) {
      const parent = findParentElement(evt.related);
      return parent?.classList.contains('dragable') && props.dragable;
    },
    onStart: () => {
      el.style.cursor = 'grabbing';
      el.classList.add('dragging');
    },
  });

  sortableInstance.value = await initializeSortable();
}

async function init() {
  await nextTick();
  initTabsSortable();
  initScrollbar();
}

onMounted(() => {
  init();
});

watch(
  () => props.styleType,
  () => {
    sortableInstance.value?.destroy();
    init();
  },
);

onUnmounted(() => {
  sortableInstance.value?.destroy();
});
</script>

<template>
  <div
    :class="{
      'overflow-hidden': styleType !== 'chrome',
    }"
    class="flex h-full flex-1"
  >
    <!-- 左侧滚动按钮 -->
    <span
      class="hover:bg-muted text-muted-foreground cursor-pointer border-r px-2"
      @click="scrollDirection('left')"
    >
      <ChevronLeft class="size-4 h-full" />
    </span>

    <TabsChrome
      v-if="styleType === 'chrome'"
      v-bind="{ ...forward, ...$attrs, ...$props }"
    />
    <Tabs v-else v-bind="{ ...forward, ...$attrs, ...$props }" />

    <!-- 左侧滚动按钮 -->
    <span
      class="hover:bg-muted text-muted-foreground cursor-pointer border-l px-2"
      @click="scrollDirection('right')"
    >
      <ChevronRight class="size-4 h-full" />
    </span>
  </div>
</template>
