<script setup lang="ts">
import type { DragVerifyActionType, VerifyMoveData } from '../typing';

import { computed, reactive, ref, unref, watch } from 'vue';

import { useTimeoutFn } from '@vueuse/core';

import DragVerify from '../drag-verify/index.vue';
import { defaultRotateVerifyProps, type RotateProps } from '../props';

const props = withDefaults(
  defineProps<RotateProps>(),
  defaultRotateVerifyProps(),
);
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
  const denominator = imgWidth! - Number.parseInt(height as string);
  if (denominator === 0) {
    return;
  }
  const currentRotate = Math.ceil(
    (moveX / denominator) * maxDegree! * unref(getFactorRef),
  );
  state.currentRotate = currentRotate;
  setImgRotate(state.randomRotate - currentRotate);
}

function handleImgOnLoad() {
  const { maxDegree, minDegree } = props;
  const ranRotate = Math.floor(
    minDegree! + Math.random() * (maxDegree! - minDegree!),
  ); // 生成随机角度
  state.randomRotate = ranRotate;
  setImgRotate(ranRotate);
}

function handleDragEnd() {
  const { currentRotate, randomRotate } = state;
  const { diffDegree } = props;

  if (Math.abs(randomRotate - currentRotate) >= (diffDegree || 20)) {
    setImgRotate(randomRotate);
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

function setImgRotate(deg: number) {
  state.imgStyle = {
    transform: `rotateZ(${deg}deg)`,
  };
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

const imgCls = computed(() => {
  return state.toOrigin ? ['transition-transform duration-300'] : [];
});

const tip = computed(() => {
  return state.isPassing
    ? `验证校验成功,耗时${((state.endTime - state.startTime) / 1000).toFixed(1)}秒！`
    : '验证失败！';
});

defineExpose({
  resume,
});
</script>

<template>
  <div class="relative flex flex-col items-center">
    <div
      :style="getImgWrapStyleRef"
      class="relative overflow-hidden rounded-full"
    >
      <img
        :class="imgCls"
        :src="src"
        :style="state.imgStyle"
        :width="parseInt(props.width as string)"
        alt="verify"
        class="w-full rounded-full"
        @click="resume"
        @load="handleImgOnLoad"
      />
      <div
        class="absolute bottom-[10px] left-0 z-10 block h-[30px] w-full text-center text-xs leading-[30px] text-white"
      >
        <div
          v-if="state.showTip"
          :style="{
            backgroundColor: state.isPassing
              ? 'hsl(var(--success))'
              : 'hsl(var(--red-700))',
          }"
        >
          {{ tip }}
        </div>
        <div
          v-if="!state.showTip && !state.draged"
          class="bg-[rgba(0,0,0,0.3)]"
        >
          点击图片可刷新
        </div>
      </div>
    </div>

    <DragVerify
      v-bind="props"
      ref="basicRef"
      :is-slot="true"
      :value="state.isPassing"
      class="mt-5"
      @end="handleDragEnd"
      @move="handleDragBarMove"
      @start="handleStart"
    >
      <template v-for="(_, key) in $slots" :key="key" #[key]="slotProps">
        <slot :name="key" v-bind="slotProps"></slot>
      </template>
    </DragVerify>
  </div>
</template>
