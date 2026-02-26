import { onUnmounted } from 'vue';

interface ResizableOptions {
  max?: number;
  min?: number;
  onChange?: (newWidth: number) => void;
}

export function useResizable(options: ResizableOptions = {}) {
  const { min = 0, max = 999, onChange } = options;

  let startX = 0;
  let startWidth = 0;
  let targetTransition = '';
  let dragBarTransition = '';
  let dragBarOffsetLeft = 0;
  let dragBarLeft = '';
  let dragBarRight = '';
  let userSelect = '';
  let cursor = '';
  let cleanup: (() => void) | null = null;

  const startDrag = (
    e: MouseEvent,
    currentWidth: number,
    targetElement: HTMLElement | null,
    dragBarElement: HTMLElement | null,
  ) => {
    cleanup?.();

    e.preventDefault();
    e.stopPropagation();

    if (!dragBarElement || !targetElement) return;

    startX = e.clientX;
    startWidth = currentWidth;

    targetTransition = targetElement.style.transition;
    dragBarTransition = dragBarElement.style.transition;

    dragBarOffsetLeft = dragBarElement.offsetLeft;
    dragBarLeft = dragBarElement.style.left;
    dragBarRight = dragBarElement.style.right;

    userSelect = document.body.style.userSelect;
    cursor = document.body.style.cursor;

    targetElement.style.transition = 'none';
    dragBarElement.style.transition = 'none';

    dragBarElement.style.left = `${dragBarOffsetLeft}px`;
    dragBarElement.style.right = 'auto';

    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const newLeft = dragBarOffsetLeft + deltaX;
      dragBarElement.style.left = `${newLeft}px`;
    };

    const onMouseUp = (upEvent: MouseEvent) => {
      const deltaX = upEvent.clientX - startX;
      let newWidth = startWidth + deltaX;
      newWidth = Math.min(max, Math.max(min, newWidth));

      if (dragBarElement) {
        dragBarElement.style.left = dragBarLeft;
        dragBarElement.style.right = dragBarRight;
      }

      onChange?.(newWidth);

      cleanup?.();
    };

    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseup', onMouseUp);

    cleanup = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      if (targetElement) {
        targetElement.style.transition = targetTransition;
      }
      if (dragBarElement) {
        dragBarElement.style.transition = dragBarTransition;
        dragBarElement.style.left = dragBarLeft;
        dragBarElement.style.right = dragBarRight;
      }

      document.body.style.userSelect = userSelect;
      document.body.style.cursor = cursor;

      cleanup = null;
    };
  };

  onUnmounted(() => {
    cleanup?.();
  });

  return {
    startDrag,
  };
}
