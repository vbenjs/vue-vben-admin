import type { SortableOptions } from 'sortablejs';

function useSortable<T extends HTMLElement>(
  sortableContainer: T,
  options: SortableOptions = {},
) {
  const initializeSortable = async () => {
    const Sortable = await import(
      // @ts-expect-error - This is a dynamic import
      'sortablejs/modular/sortable.complete.esm.js'
    );
    // const { AutoScroll } = await import(
    //   // @ts-expect-error - This is a dynamic import
    //   'sortablejs/modular/sortable.core.esm.js'
    // );

    // Sortable?.default?.mount?.(AutoScroll);

    const sortable = Sortable?.default?.create?.(sortableContainer, {
      animation: 100,
      delay: 400,
      delayOnTouchOnly: true,
      ...options,
    });
    return sortable;
  };

  return {
    initializeSortable,
  };
}

export { useSortable };
