<script setup lang="ts">
import type { Sortable } from '@vben-core/hooks';
import type { TabDefinition } from '@vben-core/typings';

import { nextTick, onMounted, onUnmounted, ref } from 'vue';

import { useForwardPropsEmits, useSortable } from '@vben-core/hooks';

import { Tabs, TabsChrome } from './components';
import { TabsProps } from './types';

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

const sortableInstance = ref<Sortable | null>(null);

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
        return;
      }

      const srcParent = findParentElement(srcElement);

      if (!srcParent) {
        return;
      }

      if (!srcParent.classList.contains('dragable')) {
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
      el.classList.remove('dragging');
      el.style.cursor = 'default';
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

onMounted(initTabsSortable);

onUnmounted(() => {
  sortableInstance.value?.destroy();
});
</script>

<template>
  <TabsChrome v-if="styleType === 'chrome'" v-bind="forward" />
  <Tabs v-else v-bind="forward" />
</template>
