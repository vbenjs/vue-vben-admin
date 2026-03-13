<script lang="ts" setup>
/**
 * This components is refactored from vue-drag-resize: https://github.com/kirillmurashov/vue-drag-resize
 */

import {
  computed,
  getCurrentInstance,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  toRefs,
  watch,
} from 'vue';

const props = defineProps({
  stickSize: {
    type: Number,
    default: 8,
  },
  parentScaleX: {
    type: Number,
    default: 1,
  },
  parentScaleY: {
    type: Number,
    default: 1,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  preventActiveBehavior: {
    type: Boolean,
    default: false,
  },
  isDraggable: {
    type: Boolean,
    default: true,
  },
  isResizable: {
    type: Boolean,
    default: true,
  },
  aspectRatio: {
    type: Boolean,
    default: false,
  },
  parentLimitation: {
    type: Boolean,
    default: false,
  },
  snapToGrid: {
    type: Boolean,
    default: false,
  },
  gridX: {
    type: Number,
    default: 50,
    validator(val: number) {
      return val >= 0;
    },
  },
  gridY: {
    type: Number,
    default: 50,
    validator(val: number) {
      return val >= 0;
    },
  },
  parentW: {
    type: Number,
    default: 0,
    validator(val: number) {
      return val >= 0;
    },
  },
  parentH: {
    type: Number,
    default: 0,
    validator(val: number) {
      return val >= 0;
    },
  },
  w: {
    type: [String, Number],
    default: 200,
    validator(val: number) {
      return typeof val === 'string' ? val === 'auto' : val >= 0;
    },
  },
  h: {
    type: [String, Number],
    default: 200,
    validator(val: number) {
      return typeof val === 'string' ? val === 'auto' : val >= 0;
    },
  },
  minw: {
    type: Number,
    default: 50,
    validator(val: number) {
      return val >= 0;
    },
  },
  minh: {
    type: Number,
    default: 50,
    validator(val: number) {
      return val >= 0;
    },
  },
  x: {
    type: Number,
    default: 0,
    validator(val: number) {
      return typeof val === 'number';
    },
  },
  y: {
    type: Number,
    default: 0,
    validator(val: number) {
      return typeof val === 'number';
    },
  },
  z: {
    type: [String, Number],
    default: 'auto',
    validator(val: number) {
      return typeof val === 'string' ? val === 'auto' : val >= 0;
    },
  },
  dragHandle: {
    type: String,
    default: null,
  },
  dragCancel: {
    type: String,
    default: null,
  },
  sticks: {
    type: Array<'bl' | 'bm' | 'br' | 'ml' | 'mr' | 'tl' | 'tm' | 'tr'>,
    default() {
      return ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml'];
    },
  },
  axis: {
    type: String,
    default: 'both',
    validator(val: string) {
      return ['both', 'none', 'x', 'y'].includes(val);
    },
  },
  contentClass: {
    type: String,
    required: false,
    default: '',
  },
});

const emit = defineEmits([
  'clicked',
  'dragging',
  'dragstop',
  'resizing',
  'resizestop',
  'activated',
  'deactivated',
]);

const styleMapping = {
  y: {
    t: 'top',
    m: 'marginTop',
    b: 'bottom',
  },
  x: {
    l: 'left',
    m: 'marginLeft',
    r: 'right',
  },
};

function addEvents(events: Map<string, (...args: any[]) => void>) {
  events.forEach((cb, eventName) => {
    document.documentElement.addEventListener(eventName, cb);
  });
}

function removeEvents(events: Map<string, (...args: any[]) => void>) {
  events.forEach((cb, eventName) => {
    document.documentElement.removeEventListener(eventName, cb);
  });
}

const {
  stickSize,
  parentScaleX,
  parentScaleY,
  isActive,
  preventActiveBehavior,
  isDraggable,
  isResizable,
  aspectRatio,
  parentLimitation,
  snapToGrid,
  gridX,
  gridY,
  parentW,
  parentH,
  w,
  h,
  minw,
  minh,
  x,
  y,
  z,
  dragHandle,
  dragCancel,
  sticks,
  axis,
  contentClass,
} = toRefs(props);

// states
const active = ref(false);
const zIndex = ref<null | number>(null);
const parentWidth = ref<null | number>(null);
const parentHeight = ref<null | number>(null);
const left = ref<null | number>(null);
const top = ref<null | number>(null);
const right = ref<null | number>(null);
const bottom = ref<null | number>(null);

const aspectFactor = ref<null | number>(null);

// state end

const stickDrag = ref(false);
const bodyDrag = ref(false);
const dimensionsBeforeMove = ref({
  pointerX: 0,
  pointerY: 0,
  x: 0,
  y: 0,
  w: 0,
  h: 0,
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  width: 0,
  height: 0,
});
const limits = ref({
  left: { min: null as null | number, max: null as null | number },
  right: { min: null as null | number, max: null as null | number },
  top: { min: null as null | number, max: null as null | number },
  bottom: { min: null as null | number, max: null as null | number },
});
const currentStick = ref<null | string>(null);

const parentElement = ref<HTMLElement | null>(null);

function getPointerPosition(
  ev: Partial<{
    pageX: number;
    pageY: number;
    touches: ArrayLike<{ pageX: number; pageY: number }>;
  }>,
): null | { pointerX: number; pointerY: number } {
  const touch = ev.touches?.[0];
  const pointerX = ev.pageX ?? touch?.pageX;
  const pointerY = ev.pageY ?? touch?.pageY;

  if (
    pointerX === null ||
    pointerX === undefined ||
    pointerY === null ||
    pointerY === undefined
  ) {
    return null;
  }

  return { pointerX, pointerY };
}

const width = computed(() => {
  const currentParentWidth = parentWidth.value;
  const currentLeft = left.value;
  const currentRight = right.value;

  if (
    currentParentWidth === null ||
    currentLeft === null ||
    currentRight === null
  ) {
    return 0;
  }

  return currentParentWidth - currentLeft - currentRight;
});

const height = computed(() => {
  const currentParentHeight = parentHeight.value;
  const currentTop = top.value;
  const currentBottom = bottom.value;

  if (
    currentParentHeight === null ||
    currentTop === null ||
    currentBottom === null
  ) {
    return 0;
  }

  return currentParentHeight - currentTop - currentBottom;
});

const rect = computed(() => ({
  left: Math.round(left.value ?? 0),
  top: Math.round(top.value ?? 0),
  width: Math.round(width.value),
  height: Math.round(height.value),
}));

const saveDimensionsBeforeMove = ({
  pointerX,
  pointerY,
}: {
  pointerX: number;
  pointerY: number;
}) => {
  dimensionsBeforeMove.value.pointerX = pointerX;
  dimensionsBeforeMove.value.pointerY = pointerY;

  dimensionsBeforeMove.value.left = left.value as number;
  dimensionsBeforeMove.value.right = right.value as number;
  dimensionsBeforeMove.value.top = top.value as number;
  dimensionsBeforeMove.value.bottom = bottom.value as number;

  dimensionsBeforeMove.value.width = width.value as number;
  dimensionsBeforeMove.value.height = height.value as number;

  aspectFactor.value = width.value / height.value;
};

const sideCorrectionByLimit = (
  limit: { max: number; min: number },
  current: number,
) => {
  let value = current;

  if (limit.min !== null && current < limit.min) {
    value = limit.min;
  } else if (limit.max !== null && limit.max < current) {
    value = limit.max;
  }

  return value;
};

const rectCorrectionByLimit = (rect: {
  newBottom: number;
  newLeft: number;
  newRight: number;
  newTop: number;
}) => {
  // const { limits } = this;
  let { newRight, newLeft, newBottom, newTop } = rect;

  type RectRange = {
    max: number;
    min: number;
  };

  newLeft = sideCorrectionByLimit(limits.value.left as RectRange, newLeft);
  newRight = sideCorrectionByLimit(limits.value.right as RectRange, newRight);
  newTop = sideCorrectionByLimit(limits.value.top as RectRange, newTop);
  newBottom = sideCorrectionByLimit(
    limits.value.bottom as RectRange,
    newBottom,
  );

  return {
    newLeft,
    newRight,
    newTop,
    newBottom,
  };
};

const rectCorrectionByAspectRatio = (rect: {
  newBottom: number;
  newLeft: number;
  newRight: number;
  newTop: number;
}) => {
  let { newLeft, newRight, newTop, newBottom } = rect;
  const currentParentWidth = parentWidth.value;
  const currentParentHeight = parentHeight.value;
  const stick = currentStick.value;
  const factor = aspectFactor.value;

  if (
    currentParentWidth === null ||
    currentParentHeight === null ||
    !stick ||
    factor === null
  ) {
    return { newLeft, newRight, newTop, newBottom };
  }

  let newWidth = currentParentWidth - newLeft - newRight;
  let newHeight = currentParentHeight - newTop - newBottom;

  if (stick[1] === 'm') {
    const deltaHeight = newHeight - dimensionsBeforeMove.value.height;

    newLeft -= (deltaHeight * factor) / 2;
    newRight -= (deltaHeight * factor) / 2;
  } else if (stick[0] === 'm') {
    const deltaWidth = newWidth - dimensionsBeforeMove.value.width;

    newTop -= deltaWidth / factor / 2;
    newBottom -= deltaWidth / factor / 2;
  } else if (newWidth / newHeight > factor) {
    newWidth = factor * newHeight;

    if (stick[1] === 'l') {
      newLeft = currentParentWidth - newRight - newWidth;
    } else {
      newRight = currentParentWidth - newLeft - newWidth;
    }
  } else {
    newHeight = newWidth / factor;

    if (stick[0] === 't') {
      newTop = currentParentHeight - newBottom - newHeight;
    } else {
      newBottom = currentParentHeight - newTop - newHeight;
    }
  }

  return { newLeft, newRight, newTop, newBottom };
};

const stickMove = (delta: { x: number; y: number }) => {
  const stick = currentStick.value;

  if (!stick) {
    return;
  }

  let newTop = dimensionsBeforeMove.value.top;
  let newBottom = dimensionsBeforeMove.value.bottom;
  let newLeft = dimensionsBeforeMove.value.left;
  let newRight = dimensionsBeforeMove.value.right;
  switch (stick[0]) {
    case 'b': {
      newBottom = dimensionsBeforeMove.value.bottom + delta.y;

      if (snapToGrid.value) {
        newBottom =
          (parentHeight.value as number) -
          Math.round(
            ((parentHeight.value as number) - newBottom) / gridY.value,
          ) *
            gridY.value;
      }

      break;
    }

    case 't': {
      newTop = dimensionsBeforeMove.value.top - delta.y;

      if (snapToGrid.value) {
        newTop = Math.round(newTop / gridY.value) * gridY.value;
      }

      break;
    }
    default: {
      break;
    }
  }

  switch (stick[1]) {
    case 'l': {
      newLeft = dimensionsBeforeMove.value.left - delta.x;

      if (snapToGrid.value) {
        newLeft = Math.round(newLeft / gridX.value) * gridX.value;
      }

      break;
    }

    case 'r': {
      newRight = dimensionsBeforeMove.value.right + delta.x;

      if (snapToGrid.value) {
        newRight =
          (parentWidth.value as number) -
          Math.round(((parentWidth.value as number) - newRight) / gridX.value) *
            gridX.value;
      }

      break;
    }
    default: {
      break;
    }
  }

  ({ newLeft, newRight, newTop, newBottom } = rectCorrectionByLimit({
    newLeft,
    newRight,
    newTop,
    newBottom,
  }));

  if (aspectRatio.value) {
    ({ newLeft, newRight, newTop, newBottom } = rectCorrectionByAspectRatio({
      newLeft,
      newRight,
      newTop,
      newBottom,
    }));
  }

  left.value = newLeft;
  right.value = newRight;
  top.value = newTop;
  bottom.value = newBottom;

  emit('resizing', rect.value);
};

const stickUp = () => {
  stickDrag.value = false;
  // dimensionsBeforeMove.value = {
  //   pointerX: 0,
  //   pointerY: 0,
  //   x: 0,
  //   y: 0,
  //   w: 0,
  //   h: 0,
  // };

  Object.assign(dimensionsBeforeMove.value, {
    pointerX: 0,
    pointerY: 0,
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  });

  limits.value = {
    left: { min: null, max: null },
    right: { min: null, max: null },
    top: { min: null, max: null },
    bottom: { min: null, max: null },
  };

  emit('resizing', rect.value);
  emit('resizestop', rect.value);
};

const calcDragLimitation = () => {
  return {
    left: { min: 0, max: (parentWidth.value as number) - width.value },
    right: { min: 0, max: (parentWidth.value as number) - width.value },
    top: { min: 0, max: (parentHeight.value as number) - height.value },
    bottom: { min: 0, max: (parentHeight.value as number) - height.value },
  };
};

const calcResizeLimits = () => {
  const parentLim = parentLimitation.value ? 0 : null;
  const currentAspectFactor = aspectFactor.value;
  const currentLeft = left.value;
  const currentRight = right.value;
  const currentTop = top.value;
  const currentBottom = bottom.value;
  const stick = currentStick.value;

  if (
    currentLeft === null ||
    currentRight === null ||
    currentTop === null ||
    currentBottom === null
  ) {
    return {
      left: { min: parentLim, max: parentLim },
      right: { min: parentLim, max: parentLim },
      top: { min: parentLim, max: parentLim },
      bottom: { min: parentLim, max: parentLim },
    };
  }

  let minWidth = minw.value;
  let minHeight = minh.value;

  if (aspectRatio.value && currentAspectFactor) {
    if (minWidth / minHeight > currentAspectFactor) {
      minHeight = minWidth / currentAspectFactor;
    } else {
      minWidth = currentAspectFactor * minHeight;
    }
  }

  const limits = {
    left: {
      min: parentLim,
      max: currentLeft + (width.value - minWidth),
    },
    right: {
      min: parentLim,
      max: currentRight + (width.value - minWidth),
    },
    top: {
      min: parentLim,
      max: currentTop + (height.value - minHeight),
    },
    bottom: {
      min: parentLim,
      max: currentBottom + (height.value - minHeight),
    },
  };

  if (aspectRatio.value && currentAspectFactor) {
    const aspectLimits = {
      left: {
        min:
          currentLeft -
          Math.min(currentTop, currentBottom) * currentAspectFactor * 2,
        max:
          currentLeft +
          ((height.value - minHeight) / 2) * currentAspectFactor * 2,
      },
      right: {
        min:
          currentRight -
          Math.min(currentTop, currentBottom) * currentAspectFactor * 2,
        max:
          currentRight +
          ((height.value - minHeight) / 2) * currentAspectFactor * 2,
      },
      top: {
        min:
          currentTop -
          (Math.min(currentLeft, currentRight) / currentAspectFactor) * 2,
        max:
          currentTop + ((width.value - minWidth) / 2 / currentAspectFactor) * 2,
      },
      bottom: {
        min:
          currentBottom -
          (Math.min(currentLeft, currentRight) / currentAspectFactor) * 2,
        max:
          currentBottom +
          ((width.value - minWidth) / 2 / currentAspectFactor) * 2,
      },
    };

    if (stick?.[0] === 'm') {
      limits.left = {
        min: Math.max(
          limits.left.min ?? aspectLimits.left.min,
          aspectLimits.left.min,
        ),
        max: Math.min(limits.left.max, aspectLimits.left.max),
      };
      limits.right = {
        min: Math.max(
          limits.right.min ?? aspectLimits.right.min,
          aspectLimits.right.min,
        ),
        max: Math.min(limits.right.max, aspectLimits.right.max),
      };
    } else if (stick?.[1] === 'm') {
      limits.top = {
        min: Math.max(
          limits.top.min ?? aspectLimits.top.min,
          aspectLimits.top.min,
        ),
        max: Math.min(limits.top.max, aspectLimits.top.max),
      };
      limits.bottom = {
        min: Math.max(
          limits.bottom.min ?? aspectLimits.bottom.min,
          aspectLimits.bottom.min,
        ),
        max: Math.min(limits.bottom.max, aspectLimits.bottom.max),
      };
    }
  }

  return limits;
};

const positionStyle = computed(() => ({
  top: `${top.value ?? 0}px`,
  left: `${left.value ?? 0}px`,
  zIndex: zIndex.value ?? 'auto',
}));

const sizeStyle = computed(() => ({
  width: w.value === 'auto' ? 'auto' : `${width.value}px`,
  height: h.value === 'auto' ? 'auto' : `${height.value}px`,
}));

const stickStyles = computed(() => (stick: string) => {
  const stickStyle = {
    width: `${stickSize.value / parentScaleX.value}px`,
    height: `${stickSize.value / parentScaleY.value}px`,
    [styleMapping.y[stick[0] as 'b' | 'm' | 't'] as 'height' | 'width']:
      `${stickSize.value / parentScaleX.value / -2}px`,
    [styleMapping.x[stick[1] as 'l' | 'm' | 'r'] as 'height' | 'width']:
      `${stickSize.value / parentScaleX.value / -2}px`,
  };
  return stickStyle;
});

const bodyMove = (delta: { x: number; y: number }) => {
  let newTop = dimensionsBeforeMove.value.top - delta.y;
  let newBottom = dimensionsBeforeMove.value.bottom + delta.y;
  let newLeft = dimensionsBeforeMove.value.left - delta.x;
  let newRight = dimensionsBeforeMove.value.right + delta.x;

  if (snapToGrid.value) {
    let alignTop = true;
    let alignLeft = true;

    let diffT = newTop - Math.floor(newTop / gridY.value) * gridY.value;
    let diffB =
      (parentHeight.value as number) -
      newBottom -
      Math.floor(((parentHeight.value as number) - newBottom) / gridY.value) *
        gridY.value;
    let diffL = newLeft - Math.floor(newLeft / gridX.value) * gridX.value;
    let diffR =
      (parentWidth.value as number) -
      newRight -
      Math.floor(((parentWidth.value as number) - newRight) / gridX.value) *
        gridX.value;

    if (diffT > gridY.value / 2) {
      diffT -= gridY.value;
    }
    if (diffB > gridY.value / 2) {
      diffB -= gridY.value;
    }
    if (diffL > gridX.value / 2) {
      diffL -= gridX.value;
    }
    if (diffR > gridX.value / 2) {
      diffR -= gridX.value;
    }

    if (Math.abs(diffB) < Math.abs(diffT)) {
      alignTop = false;
    }
    if (Math.abs(diffR) < Math.abs(diffL)) {
      alignLeft = false;
    }

    newTop -= alignTop ? diffT : diffB;
    newBottom = (parentHeight.value as number) - height.value - newTop;
    newLeft -= alignLeft ? diffL : diffR;
    newRight = (parentWidth.value as number) - width.value - newLeft;
  }

  ({
    newLeft: left.value,
    newRight: right.value,
    newTop: top.value,
    newBottom: bottom.value,
  } = rectCorrectionByLimit({ newLeft, newRight, newTop, newBottom }));

  emit('dragging', rect.value);
};

const bodyUp = () => {
  bodyDrag.value = false;
  emit('dragging', rect.value);
  emit('dragstop', rect.value);

  // dimensionsBeforeMove.value = { pointerX: 0, pointerY: 0, x: 0, y: 0, w: 0, h: 0 };
  Object.assign(dimensionsBeforeMove.value, {
    pointerX: 0,
    pointerY: 0,
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  });

  limits.value = {
    left: { min: null, max: null },
    right: { min: null, max: null },
    top: { min: null, max: null },
    bottom: { min: null, max: null },
  };
};

const stickDown = (
  stick: string,
  ev: { pageX: any; pageY: any; touches?: any },
  force = false,
) => {
  if ((!isResizable.value || !active.value) && !force) {
    return;
  }

  const pointerPosition = getPointerPosition(ev);

  if (!pointerPosition) {
    return;
  }

  stickDrag.value = true;

  saveDimensionsBeforeMove(pointerPosition);

  currentStick.value = stick;

  limits.value = calcResizeLimits();
};

const move = (ev: MouseEvent & TouchEvent) => {
  if (!stickDrag.value && !bodyDrag.value) {
    return;
  }

  ev.stopPropagation();

  const pointerPosition = getPointerPosition(ev);

  if (!pointerPosition) {
    return;
  }

  const delta = {
    x:
      (dimensionsBeforeMove.value.pointerX - pointerPosition.pointerX) /
      parentScaleX.value,
    y:
      (dimensionsBeforeMove.value.pointerY - pointerPosition.pointerY) /
      parentScaleY.value,
  };

  if (stickDrag.value) {
    stickMove(delta);
  }

  if (bodyDrag.value) {
    switch (axis.value) {
      case 'none': {
        return;
      }
      case 'x': {
        delta.y = 0;

        break;
      }
      case 'y': {
        delta.x = 0;

        break;
      }
      // No default
    }
    bodyMove(delta);
  }
};

const up = () => {
  if (stickDrag.value) {
    stickUp();
  } else if (bodyDrag.value) {
    bodyUp();
  }
};

const deselect = () => {
  if (preventActiveBehavior.value) {
    return;
  }
  active.value = false;
};

const domEvents = ref(
  new Map([
    ['mousedown', deselect],
    ['mouseleave', up],
    ['mousemove', move],
    ['mouseup', up],
    ['touchcancel', up],
    ['touchend', up],
    ['touchmove', move],
    ['touchstart', up],
  ]),
);

const container = ref<HTMLDivElement>();

onMounted(() => {
  const currentInstance = getCurrentInstance();
  const $el = currentInstance?.vnode.el as HTMLElement;

  parentElement.value = $el?.parentNode as HTMLElement;
  parentWidth.value = parentW.value ?? parentElement.value?.clientWidth;
  parentHeight.value = parentH.value ?? parentElement.value?.clientHeight;

  left.value = x.value;
  top.value = y.value;
  const containerElement = container.value;
  const contentWidth =
    w.value === 'auto'
      ? (containerElement?.scrollWidth ?? 0)
      : (w.value as number);
  const contentHeight =
    h.value === 'auto'
      ? (containerElement?.scrollHeight ?? 0)
      : (h.value as number);
  right.value = (parentWidth.value ?? 0) - contentWidth - (left.value ?? 0);
  bottom.value = (parentHeight.value ?? 0) - contentHeight - (top.value ?? 0);

  addEvents(domEvents.value);

  if (dragHandle.value) {
    [...($el?.querySelectorAll(dragHandle.value) || [])].forEach(
      (dragHandle) => {
        (dragHandle as HTMLElement).dataset.dragHandle = String(
          currentInstance?.uid,
        );
      },
    );
  }

  if (dragCancel.value) {
    [...($el?.querySelectorAll(dragCancel.value) || [])].forEach(
      (cancelHandle) => {
        (cancelHandle as HTMLElement).dataset.dragCancel = String(
          currentInstance?.uid,
        );
      },
    );
  }
});
onBeforeUnmount(() => {
  removeEvents(domEvents.value);
});

const bodyDown = (ev: MouseEvent & TouchEvent) => {
  const { target, button } = ev;
  const targetElement = target instanceof HTMLElement ? target : null;
  const uid = getCurrentInstance()?.uid.toString();

  if (!preventActiveBehavior.value) {
    active.value = true;
  }

  if (button && button !== 0) {
    return;
  }

  emit('clicked', ev);

  if (!active.value) {
    return;
  }

  if (
    dragHandle.value &&
    targetElement &&
    targetElement.dataset.dragHandle !== uid
  ) {
    return;
  }

  if (dragCancel.value && targetElement?.dataset.dragCancel === uid) {
    return;
  }

  if (ev.stopPropagation !== undefined) {
    ev.stopPropagation();
  }

  if (ev.preventDefault !== undefined) {
    ev.preventDefault();
  }

  const pointerPosition = getPointerPosition(ev);

  if (!pointerPosition) {
    return;
  }

  if (isDraggable.value) {
    bodyDrag.value = true;
  }

  saveDimensionsBeforeMove(pointerPosition);

  if (parentLimitation.value) {
    limits.value = calcDragLimitation();
  }
};

watch(
  () => active.value,
  (isActive) => {
    if (isActive) {
      emit('activated');
    } else {
      emit('deactivated');
    }
  },
);

watch(
  () => isActive.value,
  (val) => {
    active.value = val;
  },
  { immediate: true },
);

watch(
  () => z.value,
  (val) => {
    if (typeof val === 'number' && val >= 0) {
      zIndex.value = val;
    } else if (val === 'auto') {
      zIndex.value = null;
    }
  },
  { immediate: true },
);

watch(
  () => x.value,
  (newVal, oldVal) => {
    const currentLeft = left.value;
    const currentTop = top.value;

    if (
      stickDrag.value ||
      bodyDrag.value ||
      currentLeft === null ||
      currentTop === null ||
      newVal === currentLeft
    ) {
      return;
    }

    const delta = oldVal - newVal;

    bodyDown({ pageX: currentLeft, pageY: currentTop } as MouseEvent &
      TouchEvent);
    bodyMove({ x: delta, y: 0 });

    nextTick(() => {
      bodyUp();
    });
  },
);

watch(
  () => y.value,
  (newVal, oldVal) => {
    const currentLeft = left.value;
    const currentTop = top.value;

    if (
      stickDrag.value ||
      bodyDrag.value ||
      currentLeft === null ||
      currentTop === null ||
      newVal === currentTop
    ) {
      return;
    }

    const delta = oldVal - newVal;

    bodyDown({ pageX: currentLeft, pageY: currentTop } as MouseEvent &
      TouchEvent);
    bodyMove({ x: 0, y: delta });

    nextTick(() => {
      bodyUp();
    });
  },
);

watch(
  () => w.value,
  (newVal, oldVal) => {
    const currentRight = right.value;
    const currentTop = top.value;

    if (stickDrag.value || bodyDrag.value || newVal === width.value) {
      return;
    }

    if (currentRight === null || currentTop === null) {
      return;
    }

    const stick = 'mr';
    const delta = (oldVal as number) - (newVal as number);

    stickDown(
      stick,
      { pageX: currentRight, pageY: currentTop + height.value / 2 },
      true,
    );
    stickMove({ x: delta, y: 0 });

    nextTick(() => {
      stickUp();
    });
  },
);

watch(
  () => h.value,
  (newVal, oldVal) => {
    const currentLeft = left.value;
    const currentBottom = bottom.value;

    if (stickDrag.value || bodyDrag.value || newVal === height.value) {
      return;
    }

    if (currentLeft === null || currentBottom === null) {
      return;
    }

    const stick = 'bm';
    const delta = (oldVal as number) - (newVal as number);

    stickDown(
      stick,
      { pageX: currentLeft + width.value / 2, pageY: currentBottom },
      true,
    );
    stickMove({ x: 0, y: delta });

    nextTick(() => {
      stickUp();
    });
  },
);

watch(
  () => parentW.value,
  (val) => {
    right.value = val - width.value - (left.value ?? 0);
    parentWidth.value = val;
  },
);

watch(
  () => parentH.value,
  (val) => {
    bottom.value = val - height.value - (top.value ?? 0);
    parentHeight.value = val;
  },
);
</script>

<template>
  <div
    :class="`${active || isActive ? 'active' : 'inactive'} ${contentClass ? contentClass : ''}`"
    :style="positionStyle"
    class="resize"
    @mousedown="bodyDown($event as TouchEvent & MouseEvent)"
    @touchend="up"
    @touchstart="bodyDown($event as TouchEvent & MouseEvent)"
  >
    <div ref="container" :style="sizeStyle" class="content-container">
      <slot></slot>
    </div>
    <div
      v-for="(stick, index) of sticks"
      :key="index"
      :class="[`resize-stick-${stick}`, isResizable ? '' : 'not-resizable']"
      :style="stickStyles(stick)"
      class="resize-stick"
      @mousedown.stop.prevent="
        stickDown(stick, $event as TouchEvent & MouseEvent)
      "
      @touchstart.stop.prevent="
        stickDown(stick, $event as TouchEvent & MouseEvent)
      "
    ></div>
  </div>
</template>

<style lang="css" scoped>
.resize {
  position: absolute;
  box-sizing: border-box;
}

.resize.active::before {
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  outline: 1px dashed #d6d6d6;
  content: '';
}

.resize-stick {
  position: absolute;
  box-sizing: border-box;
  font-size: 1px;
  background: #fff;
  border: 1px solid #6c6c6c;
  box-shadow: 0 0 2px #bbb;
}

.inactive .resize-stick {
  display: none;
}

.resize-stick-tl,
.resize-stick-br {
  cursor: nwse-resize;
}

.resize-stick-tm,
.resize-stick-bm {
  left: 50%;
  cursor: ns-resize;
}

.resize-stick-tr,
.resize-stick-bl {
  cursor: nesw-resize;
}

.resize-stick-ml,
.resize-stick-mr {
  top: 50%;
  cursor: ew-resize;
}

.resize-stick.not-resizable {
  display: none;
}

.content-container {
  position: relative;
  display: block;
}
</style>
