import type {EmitType} from '@vben-core/typings';
import type {TabsProps} from './types';
import {onMounted, onUnmounted, ref, watch} from 'vue';
import {type Sortable, useIsMobile, useSortable} from '@vben-core/composables';

// 找到拖拽的父元素，确保拖拽的是tab元素
function findParentElement(element: HTMLElement) {
  const parentCls = 'group';
  return element.classList.contains(parentCls)
    ? element
    : element.closest(`.${parentCls}`);
}

export function useTabsDrag(props: TabsProps, emit: EmitType) {
  const sortableInstance = ref<Sortable | null>(null);
  const originalOrder = ref([]);

  async function initTabsSortable() {
    const el = document.querySelector(`.${props.contentClass}`) as HTMLElement;

    if (!el) {
      console.warn('Element not found for sortable initialization');
      return;
    }

    const {initializeSortable} = useSortable(el, {
      dataIdAttr: 'data-title',
      filter: (evt, target: HTMLElement) => {
        const parent = findParentElement(target);
        const isDraggable = parent?.classList.contains('draggable');
        return !isDraggable || target.classList.contains('affix-tab');
      },
      onEnd(evt) {
        evt.item.style.opacity = 1;
        const {newIndex} = evt;
        if (!evt.originalEvent.cancelable || evt.target.children[newIndex + 1]?.classList.contains('affix-tab')) {
          sortableInstance.value.sort(originalOrder.value, true);
          return;
        }
      },
      onMove(evt) {
        const parent = findParentElement(evt.related);
        return parent?.classList.contains('draggable') && props.draggable ? evt : false;
      },
      onStart(evt) {
        originalOrder.value = sortableInstance.value.toArray();// 记录当前的顺序
        evt.item.style.opacity = 0;
      },
    });

    sortableInstance.value = await initializeSortable();
  }

  function init() {
    const {isMobile} = useIsMobile();

    // 移动端下tab不需要拖拽
    if (isMobile.value) return;

    initTabsSortable();
  }

  onMounted(init);

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
}
