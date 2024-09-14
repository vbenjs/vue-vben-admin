<script setup lang="ts">
import {
  computed,
  type PropType,
  reactive,
  ref,
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
const barElRef = ref<typeof BarCmp>();
const contentElRef = ref<typeof ContentCmp>();
const actionElRef = ref<typeof ActionCmp>();

useEventListener({
  el: document,
  listener: () => {
    if (state.isMoving) {
      resume();
    }
  },
  name: 'mouseup',
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
  if (!actionElRef.value) return;
  emit('start', e);

  state.moveDistance =
    getEventPageX(e) -
    Number.parseInt(actionElRef.value.getStyle().left.replace('px', ''), 10);
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
    const { actionWidth, offset, widthNum } = getOffset(actionEl.getEl());
    const moveX = getEventPageX(e) - moveDistance;

    emit('move', {
      event: e,
      moveDistance,
      moveX,
    });
    if (moveX > 0 && moveX <= offset) {
      actionEl.setLeft(`${moveX}px`);
      barEl.setWidth(`${moveX + actionWidth / 2}px`);
    } else if (moveX > offset) {
      actionEl.setLeft(`${widthNum - actionWidth}px`);
      barEl.setWidth(`${widthNum - actionWidth / 2}px`);
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
    const actionEl = actionElRef.value;
    const barEl = unref(barElRef);
    if (!actionEl || !barEl) return;
    const moveX = getEventPageX(e) - moveDistance;
    const { actionWidth, offset, widthNum } = getOffset(actionEl.getEl());
    if (moveX < offset) {
      if (props.isSlot) {
        setTimeout(() => {
          if (props.value) {
            const contentEl = unref(contentElRef);
            if (contentEl) {
              contentEl.style.width = `${Number.parseInt(barEl.getEl().style.width)}px`;
            }
          } else {
            resume();
          }
        }, 0);
      } else {
        resume();
      }
    } else {
      actionEl.setLeft(`${widthNum - actionWidth}px`);
      barEl.setWidth(`${widthNum - actionWidth / 2}px`);
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
    actionEl.setLeft('0px');
    barEl.setWidth('0px');
    //  The time is consistent with the animation time
  }, 300);
}
</script>

<template>
  <div
    ref="wrapElRef"
    :style="getWrapStyleRef"
    class="relative overflow-hidden rounded-md border border-gray-300 bg-gray-200 text-center"
    @mouseleave="handleDragOver"
    @mousemove="handleDragMoving"
    @mouseup="handleDragOver"
    @touchend="handleDragOver"
    @touchmove="handleDragMoving"
  >
    <BarCmp
      ref="barElRef"
      :bar-style="barStyle"
      :circle="circle"
      :height="height"
      :to-left="state.toLeft"
    />
    <ContentCmp
      ref="contentElRef"
      :content-style="contentStyle"
      :height="height"
      :is-passing="state.isPassing"
      :success-text="successText"
      :text="text"
      :width="width"
    />
    <ActionCmp
      ref="actionElRef"
      :action-style="actionStyle"
      :height="height"
      :is-passing="state.isPassing"
      :to-left="state.toLeft"
      @mousedown="handleDragStart"
      @touchstart="handleDragStart"
    />
  </div>
</template>
