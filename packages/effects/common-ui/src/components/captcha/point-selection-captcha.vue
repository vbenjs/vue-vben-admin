<script setup lang="ts">
import { computed, ref } from 'vue';

import { SvgRefreshIcon } from '@vben/icons';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  VbenButton,
  VbenIconButton,
} from '@vben-core/shadcn-ui';

import { type Point } from '.';

interface Props {
  /**
   * 点选的图片
   * @default '12px'
   */
  captchaImage: string;
  /**
   * 验证码图片高度
   * @default '220px'
   */
  height?: number | string;
  /**
   * 提示图片高度
   * @default '40px'
   */
  hintHeight?: number | string;
  /**
   * 提示图片宽度
   * @default '150px'
   */
  hintWidth?: number | string;
  /**
   * 提示图片
   * @default '12px'
   */
  hintImage: string;
  /**
   * 水平内边距
   * @default '12px'
   */
  paddingX?: number | string;
  /**
   * 垂直内边距
   * @default '16px'
   */
  paddingY?: number | string;
  /**
   * 标题
   * @default '请按图依次点击'
   */
  title?: string;
  /**
   * 验证码图片宽度
   * @default '300px'
   */
  width?: number | string;
}

const props = withDefaults(defineProps<Props>(), {
  height: '220px',
  hintHeight: '40px',
  hintWidth: '150px',
  paddingX: '12px',
  paddingY: '16px',
  title: '请按图依次点击',
  width: '300px',
});

const emit = defineEmits<{
  click: [number, number];
  confirm: [Array<Point>, clear: () => void];
  refresh: [];
}>();

const parseValue = (value: number | string) => {
  if (typeof value === 'number') {
    return value;
  }
  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const rootStyles = computed(() => ({
  padding: `${parseValue(props.paddingY)}px ${parseValue(props.paddingX)}px`,
  width: `${parseValue(props.width) - parseValue(props.paddingX) * 2}px`,
}));

const hintStyles = computed(() => ({
  height: `${parseValue(props.hintHeight)}px`,
  width: `${parseValue(props.hintWidth)}px`,
}));

const captchaStyles = computed(() => {
  return {
    height: `${parseValue(props.height)}px`,
    width: `${parseValue(props.width)}px`,
  };
});

function getElementPosition(element: HTMLElement) {
  let posX = 0;
  let posY = 0;
  if (element.getBoundingClientRect) {
    const rect = element.getBoundingClientRect();
    const doc = document.documentElement;
    posX =
      rect.left +
      Math.max(doc.scrollLeft, document.body.scrollLeft) -
      doc.clientLeft;
    posY =
      rect.top +
      Math.max(doc.scrollTop, document.body.scrollTop) -
      doc.clientTop;
  } else {
    while (element !== document.body) {
      posX += element.offsetLeft;
      posY += element.offsetTop;
      element = element.offsetParent as HTMLElement;
    }
  }
  return {
    x: posX,
    y: posY,
  };
}
const points = ref<Point[]>([]);
const POINT_OFFSET = 11;

function handleClick(e: any | Event) {
  try {
    const dom = e.currentTarget as HTMLElement;
    if (!dom) throw new Error('Element not found');

    const { x: domX, y: domY } = getElementPosition(dom);

    const mouseX = e.pageX || e.clientX;
    const mouseY = e.pageY || e.clientY;

    if (mouseX === undefined || mouseY === undefined)
      throw new Error('Mouse coordinates not found');

    const xPos = mouseX - domX;
    const yPos = mouseY - domY;

    const x = Math.ceil(xPos);
    const y = Math.ceil(yPos);

    points.value.push({
      i: points.value.length,
      t: Date.now(),
      x,
      y,
    });

    emit('click', x, y);
    e.cancelBubble = true;
    e.preventDefault();
  } catch (error) {
    console.error('Error in handleClick:', error);
  }
}

function clear() {
  try {
    points.value = [];
  } catch (error) {
    console.error('Error in clear:', error);
  }
}

function handleRefresh() {
  try {
    clear();
    emit('refresh');
  } catch (error) {
    console.error('Error in handleRefresh:', error);
  }
}

function handleConfirm() {
  try {
    emit('confirm', points.value, clear);
  } catch (error) {
    console.error('Error in handleConfirm:', error);
  }
}
</script>
<template>
  <Card :style="rootStyles" aria-labelledby="captcha-title" role="region">
    <CardHeader class="p-0">
      <CardTitle id="captcha-title" class="flex items-center justify-between">
        <span>{{ title }}</span>
        <img
          v-show="hintImage"
          :src="hintImage"
          :style="hintStyles"
          alt="提示图片"
        />
      </CardTitle>
    </CardHeader>
    <CardContent class="relative mt-2 flex w-full overflow-hidden rounded p-0">
      <img
        v-show="captchaImage"
        :src="captchaImage"
        :style="captchaStyles"
        alt="验证码图片"
        class="relative z-10"
        @click="handleClick"
      />
      <div class="absolute inset-0">
        <div
          v-for="(point, index) in points"
          :key="index"
          :style="{
            top: `${point.y - POINT_OFFSET}px`,
            left: `${point.x - POINT_OFFSET}px`,
          }"
          aria-label="点击点 {{ index + 1 }}"
          class="bg-primary text-primary-50 border-primary-50 absolute z-20 flex h-5 w-5 cursor-default items-center justify-center rounded-full border-2"
          role="button"
        >
          {{ index + 1 }}
        </div>
      </div>
    </CardContent>
    <CardFooter class="mt-2 flex justify-between p-0">
      <VbenIconButton aria-label="刷新验证码" @click="handleRefresh">
        <SvgRefreshIcon class="size-6" />
      </VbenIconButton>
      <VbenButton aria-label="确认选择" @click="handleConfirm">
        确认
      </VbenButton>
    </CardFooter>
  </Card>
</template>
