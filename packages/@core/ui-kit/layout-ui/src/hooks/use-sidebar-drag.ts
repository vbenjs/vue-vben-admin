import { onUnmounted } from 'vue';

interface DragOptions {
  max: number;
  min: number;
  startWidth: number;
}

interface DragElements {
  dragBar: HTMLElement | null;
  target: HTMLElement | null;
}

type DragCallback = (newWidth: number) => void;

export function useSidebarDrag() {
  const state: {
    cleanup: (() => void) | null;
    isDragging: boolean;
    originalStyles: {
      bodyCursor: string;
      bodyUserSelect: string;
      dragBarLeft: string;
      dragBarRight: string;
      dragBarTransition: string;
      targetTransition: string;
    };
    startLeft: number;
    startWidth: number;
    startX: number;
  } = {
    cleanup: null,
    isDragging: false,
    startLeft: 0,
    startWidth: 0,
    startX: 0,
    originalStyles: {
      bodyCursor: '',
      bodyUserSelect: '',
      dragBarLeft: '',
      dragBarRight: '',
      dragBarTransition: '',
      targetTransition: '',
    },
  };

  const startDrag = (
    e: MouseEvent,
    options: DragOptions,
    elements: DragElements,
    onDrag: DragCallback,
  ) => {
    const { min, max, startWidth } = options;
    const { dragBar, target } = elements;

    if (state.isDragging || !dragBar || !target) return;

    e.preventDefault();
    e.stopPropagation();

    state.isDragging = true;

    state.startX = e.clientX;
    state.startWidth = startWidth;
    state.startLeft = dragBar.offsetLeft;

    state.originalStyles = {
      bodyCursor: document.body.style.cursor,
      bodyUserSelect: document.body.style.userSelect,
      dragBarLeft: dragBar.style.left,
      dragBarRight: dragBar.style.right,
      dragBarTransition: dragBar.style.transition,
      targetTransition: target.style.transition,
    };

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    dragBar.style.left = `${state.startLeft}px`;
    dragBar.style.right = 'auto';
    dragBar.style.transition = 'none';
    target.style.transition = 'none';

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!state.isDragging || !dragBar) return;

      const deltaX = moveEvent.clientX - state.startX;
      let newLeft = state.startLeft + deltaX;

      if (newLeft < min) newLeft = min;
      if (newLeft > max) newLeft = max;

      dragBar.style.left = `${newLeft}px`;
      dragBar.classList.add('bg-primary');
    };

    const onMouseUp = (upEvent: MouseEvent) => {
      if (!state.isDragging || !dragBar || !target) return;

      const deltaX = upEvent.clientX - state.startX;
      let newWidth = state.startWidth + deltaX;

      newWidth = Math.min(max, Math.max(min, newWidth));

      dragBar.classList.remove('bg-primary');

      onDrag?.(newWidth);

      endDrag();
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    const cleanup = () => {
      if (!state.cleanup) return;

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      document.body.style.cursor = state.originalStyles.bodyCursor;
      document.body.style.userSelect = state.originalStyles.bodyUserSelect;

      if (dragBar) {
        dragBar.style.left = state.originalStyles.dragBarLeft;
        dragBar.style.right = state.originalStyles.dragBarRight;
        dragBar.style.transition = state.originalStyles.dragBarTransition;
        dragBar.classList.remove('bg-primary');
      }

      if (target) {
        target.style.transition = state.originalStyles.targetTransition;
      }

      state.isDragging = false;
      state.cleanup = null;
    };

    state.cleanup = cleanup;
  };

  const endDrag = () => {
    state.cleanup?.();
  };

  onUnmounted(() => {
    endDrag();
  });

  return {
    startDrag,
    endDrag,
    get isDragging() {
      return state.isDragging;
    },
  };
}
