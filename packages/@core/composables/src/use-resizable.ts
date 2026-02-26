import { onUnmounted, ref } from 'vue';

interface ResizableOptions {
  max?: number;
  min?: number;
  onChange?: (newWidth: number) => void;
}

export function useResizable(options: ResizableOptions = {}) {
  const { min = 0, max = 999, onChange } = options;

  const isDragging = ref(false);

  let cleanup: (() => void) | null = null;

  let userSelect = '';
  let cursor = '';

  const startDrag = (e: MouseEvent, width: number) => {
    e.preventDefault();
    e.stopPropagation();

    isDragging.value = true;
    const startX = e.clientX;
    const startWidth = width;

    userSelect = document.body.style.userSelect;
    cursor = document.body.style.cursor;

    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!isDragging.value) return;

      const deltaX = moveEvent.clientX - startX;
      let newWidth = startWidth + deltaX;

      newWidth = Math.min(max, Math.max(min, newWidth));

      onChange?.(newWidth);
    };

    const onMouseUp = () => {
      if (!isDragging.value) return;
      cleanup?.();
    };

    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseup', onMouseUp);

    cleanup = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      document.body.style.userSelect = userSelect;
      document.body.style.cursor = cursor;

      isDragging.value = false;
      cleanup = null;
    };
  };

  onUnmounted(() => {
    cleanup?.();
  });

  return {
    isDragging,
    startDrag,
  };
}
