<script setup lang="ts">
import {
  computed,
  type PropType,
  reactive,
  ref,
  type Ref,
  unref,
  watch,
  watchEffect,
} from 'vue';

import { useTimeoutFn } from '@vueuse/core';

import { useEventListener } from '../use-event-listener';
import ActionCmp from './action.vue';
import BarCmp from './bar.vue';
import ContentCmp from './content.vue';

const props = defineProps({
  actionStyle: {
    default: () => ({}),
    type: Object as PropType<any>,
  },

  barStyle: {
    default: () => ({}),
    type: Object as PropType<any>,
  },

  circle: {
    default: false,
    type: Boolean as PropType<boolean>,
  },
  contentStyle: {
    default: () => ({}),
    type: Object as PropType<any>,
  },
  height: {
    default: 40,
    type: [Number, String] as PropType<number | string>,
  },

  isSlot: {
    default: false,
    type: Boolean as PropType<boolean>,
  },

  successText: {
    default: '验证通过',
    type: [String] as PropType<string>,
  },

  text: {
    default: '请按住滑块拖动',
    type: [String] as PropType<string>,
  },
  value: {
    default: false,
    type: Boolean as PropType<boolean>,
  },
  width: {
    default: 220,
    type: [Number, String] as PropType<number | string>,
  },
  wrapStyle: {
    default: () => ({}),
    type: Object as PropType<any>,
  },
});

const emit = defineEmits([
  'success',
  'update:value',
  'change',
  'start',
  'move',
  'end',
]);

const state = reactive({
  endTime: 0,
  isMoving: false,
  isPassing: false,
  moveDistance: 0,
  startTime: 0,
  toLeft: false,
});

defineExpose({
  resume,
});

const wrapElRef = ref<HTMLDivElement>();
const barElRef = ref<HTMLDivElement | null>(null);
const contentElRef = ref<HTMLDivElement | null>(null);
const actionElRef = ref(null) as Ref<HTMLDivElement | null>;

useEventListener({
  el: document,
  listener: () => {
    if (state.isMoving) {
      resume();
    }
  },
  name: 'mouseup',
});

const getActionStyleRef = computed(() => {
  const { actionStyle, height } = props;
  const h = `${Number.parseInt(height as string)}px`;
  return {
    height: h,
    left: 0,
    width: h,
    ...actionStyle,
  };
});

const getWrapStyleRef = computed(() => {
  const { circle, height, width, wrapStyle } = props;
  const h = Number.parseInt(height as string);
  const w = `${Number.parseInt(width as string)}px`;
  return {
    borderRadius: circle ? `${h / 2}px` : 0,
    height: `${h}px`,
    lineHeight: `${h}px`,
    width: w,
    ...wrapStyle,
  };
});

const getBarStyleRef = computed(() => {
  const { barStyle, circle, height } = props;
  const h = Number.parseInt(height as string);
  return {
    borderRadius: circle ? `${h / 2}px 0 0 ${h / 2}px` : 0,
    height: `${h}px`,
    ...barStyle,
  };
});

const getContentStyleRef = computed(() => {
  const { contentStyle, height, width } = props;
  const h = `${Number.parseInt(height as string)}px`;
  const w = `${Number.parseInt(width as string)}px`;

  return {
    height: h,
    width: w,
    ...contentStyle,
  };
});

watch(
  () => state.isPassing,
  (isPassing) => {
    if (isPassing) {
      const { endTime, startTime } = state;
      const time = (endTime - startTime) / 1000;
      emit('success', { isPassing, time: time.toFixed(1) });
      emit('update:value', isPassing);
      emit('change', isPassing);
    }
  },
);

watchEffect(() => {
  state.isPassing = !!props.value;
});

function getEventPageX(e: MouseEvent | TouchEvent): number {
  if (e instanceof MouseEvent) {
    return e.pageX;
  } else if (e instanceof TouchEvent && e.touches[0]) {
    return e.touches[0].pageX;
  }
  return 0;
}

function handleDragStart(e: MouseEvent | TouchEvent) {
  if (state.isPassing) {
    return;
  }
  const actionEl = unref(actionElRef);
  if (!actionEl) return;
  emit('start', e);
  state.moveDistance =
    getEventPageX(e) -
    Number.parseInt(actionEl.style.left.replace('px', ''), 10);
  state.startTime = Date.now();
  state.isMoving = true;
}

function getOffset(el: HTMLDivElement) {
  const actionWidth = Number.parseInt(el.style.width);
  const { width } = props;
  const widthNum = Number.parseInt(width as string);
  const offset = widthNum - actionWidth - 6;
  return { actionWidth, offset, widthNum };
}

function handleDragMoving(e: MouseEvent | TouchEvent) {
  const { isMoving, moveDistance } = state;
  if (isMoving) {
    const actionEl = unref(actionElRef);
    const barEl = unref(barElRef);
    if (!actionEl || !barEl) return;
    const { actionWidth, offset, widthNum } = getOffset(actionEl);
    const moveX = getEventPageX(e) - moveDistance;

    emit('move', {
      event: e,
      moveDistance,
      moveX,
    });
    if (moveX > 0 && moveX <= offset) {
      actionEl.style.left = `${moveX}px`;
      barEl.style.width = `${moveX + actionWidth / 2}px`;
    } else if (moveX > offset) {
      actionEl.style.left = `${widthNum - actionWidth}px`;
      barEl.style.width = `${widthNum - actionWidth / 2}px`;
      if (!props.isSlot) {
        checkPass();
      }
    }
  }
}

function handleDragOver(e: MouseEvent | TouchEvent) {
  const { isMoving, isPassing, moveDistance } = state;
  if (isMoving && !isPassing) {
    emit('end', e);
    const actionEl = unref(actionElRef);
    const barEl = unref(barElRef);
    if (!actionEl || !barEl) return;
    const moveX = getEventPageX(e) - moveDistance;
    const { actionWidth, offset, widthNum } = getOffset(actionEl);
    if (moveX < offset) {
      if (props.isSlot) {
        setTimeout(() => {
          if (props.value) {
            const contentEl = unref(contentElRef);
            if (contentEl) {
              contentEl.style.width = `${Number.parseInt(barEl.style.width)}px`;
            }
          } else {
            resume();
          }
        }, 0);
      } else {
        resume();
      }
    } else {
      actionEl.style.left = `${widthNum - actionWidth}px`;
      barEl.style.width = `${widthNum - actionWidth / 2}px`;
      checkPass();
    }
    state.isMoving = false;
  }
}

function checkPass() {
  if (props.isSlot) {
    resume();
    return;
  }
  state.endTime = Date.now();
  state.isPassing = true;
  state.isMoving = false;
}

function resume() {
  state.isMoving = false;
  state.isPassing = false;
  state.moveDistance = 0;
  state.toLeft = false;
  state.startTime = 0;
  state.endTime = 0;
  const actionEl = unref(actionElRef);
  const barEl = unref(barElRef);
  const contentEl = unref(contentElRef);
  if (!actionEl || !barEl || !contentEl) return;
  state.toLeft = true;
  useTimeoutFn(() => {
    state.toLeft = false;
    actionEl.style.left = '0';
    barEl.style.width = '0';
    //  The time is consistent with the animation time
  }, 300);
  contentEl.style.width = unref(getContentStyleRef).width;
}
</script>

<template>
  <div
    ref="wrapElRef"
    :style="getWrapStyleRef"
    class="darg-verify"
    @onMouseleave="handleDragOver"
    @onMousemove="handleDragMoving"
    @onMouseup="handleDragOver"
    @onTouchend="handleDragOver"
    @onTouchmove="handleDragMoving"
  >
    <BarCmp :style="getBarStyleRef" />
    <ContentCmp :success-text="successText" :text="text" />
    <ActionCmp
      :style="getActionStyleRef"
      @on-mousedown="handleDragStart"
      @on-touchstart="handleDragStart"
    />
  </div>
</template>
