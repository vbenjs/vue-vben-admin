<script setup lang="ts">
import type { DragVerifyActionType, VerifyMoveData } from '../typing';

import { computed, reactive, ref, unref, watch } from 'vue';

import { useTimeoutFn } from '@vueuse/core';

import DragVerify from '../drag-verify/index.vue';
import { rotateProps } from '../props';

const props = defineProps(rotateProps);
const emit = defineEmits(['success', 'change', 'update:value']);
const basicRef = ref<DragVerifyActionType | null>(null);
const state = reactive({
  currentRotate: 0,
  draged: false,
  endTime: 0,
  imgStyle: {},
  isPassing: false,
  randomRotate: 0,
  showTip: false,
  startTime: 0,
  toOrigin: false,
});
watch(
  () => state.isPassing,
  (isPassing) => {
    if (isPassing) {
      const { endTime, startTime } = state;
      const time = (endTime - startTime) / 1000;
      emit('success', { isPassing, time: time.toFixed(1) });
      emit('change', isPassing);
      emit('update:value', isPassing);
    }
  },
);

const getImgWrapStyleRef = computed(() => {
  const { imgWidth, imgWrapStyle } = props;
  return {
    height: `${imgWidth}px`,
    width: `${imgWidth}px`,
    ...imgWrapStyle,
  };
});

const getFactorRef = computed(() => {
  const { maxDegree, minDegree } = props;
  if (minDegree === maxDegree) {
    return Math.floor(1 + Math.random() * 1) / 10 + 1;
  }
  return 1;
});
function handleStart() {
  state.startTime = Date.now();
}

function handleDragBarMove(data: VerifyMoveData) {
  state.draged = true;
  const { height, imgWidth, maxDegree } = props;
  const { moveX } = data;
  const currentRotate = Math.ceil(
    (moveX / (imgWidth! - Number.parseInt(height as string))) *
      maxDegree! *
      unref(getFactorRef),
  );
  state.currentRotate = currentRotate;
  state.imgStyle = {
    transform: `rotateZ(${state.randomRotate - currentRotate}deg)`,
  };
}

function handleImgOnLoad() {
  const { maxDegree, minDegree } = props;
  const ranRotate = Math.floor(
    minDegree! + Math.random() * (maxDegree! - minDegree!),
  ); // 生成随机角度
  state.randomRotate = ranRotate;
  state.imgStyle = {
    transform: `rotateZ(${ranRotate}deg)`,
  };
}

function handleDragEnd() {
  const { currentRotate, randomRotate } = state;
  const { diffDegree } = props;

  if (Math.abs(randomRotate - currentRotate) >= (diffDegree || 20)) {
    state.imgStyle = {
      transform: `rotateZ(${randomRotate}deg)`,
    };
    state.toOrigin = true;
    useTimeoutFn(() => {
      state.toOrigin = false;
      state.showTip = true;
      //  时间与动画时间保持一致
    }, 300);
  } else {
    checkPass();
  }
  state.showTip = true;
}
function checkPass() {
  state.isPassing = true;
  state.endTime = Date.now();
}

function resume() {
  state.showTip = false;
  const basicEl = unref(basicRef);
  if (!basicEl) {
    return;
  }
  state.isPassing = false;

  basicEl.resume();
  handleImgOnLoad();
}

defineExpose({
  resume,
});
</script>

<template>
  <div class="ir-dv">
    <div :style="getImgWrapStyleRef" class="ir-dv-img__wrap"></div>
    <span
      v-if="state.showTip"
      :class="[state.isPassing ? 'success' : 'error']"
      class="ir-dv-img__tip"
    >
      {{
        state.isPassing
          ? `验证校验成功,耗时${state.endTime - state.startTime}秒！`
          : '验证失败！'
      }}
    </span>
    <span v-if="!state.showTip && !state.draged" class="ir-dv-img__tip normal">
      点击图片可刷新
    </span>

    <DragVerify
      ref="basicRef"
      :value="state.isPassing"
      class="ir-dv-drag__bar"
      @end="handleDragEnd"
      @move="handleDragBarMove"
      @start="handleStart"
    />
  </div>
</template>

<style scoped></style>
