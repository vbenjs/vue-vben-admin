import type { SortableOptions } from 'sortablejs';
import type Sortable from 'sortablejs';

// 泛型参数是已发布的公共 API 契约（调用方以 useSortable<HTMLUListElement>(el)
// 显式指定容器元素类型），规则只看签名内出现次数，不能据此删除。
// oxlint-disable-next-line typescript/no-unnecessary-type-parameters
function useSortable<T extends HTMLElement>(
  sortableContainer: T,
  options: SortableOptions = {},
) {
  const initializeSortable = async () => {
    const Sortable = await import(
      // @ts-expect-error - This is a dynamic import
      'sortablejs/modular/sortable.complete.esm.js'
    );
    const sortable = Sortable?.default?.create?.(sortableContainer, {
      animation: 300,
      delay: 400,
      delayOnTouchOnly: true,
      ...options,
    });
    return sortable as Sortable;
  };

  return {
    initializeSortable,
  };
}

export { useSortable };

export type { Sortable };
