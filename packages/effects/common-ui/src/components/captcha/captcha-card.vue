<script setup lang="ts">
import type { CaptchaCardProps } from './types';

import { computed } from 'vue';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@vben-core/shadcn-ui';

import { parseValue } from './utils';

const props = withDefaults(defineProps<CaptchaCardProps>(), {
  height: '220px',
  paddingX: '12px',
  paddingY: '16px',
  title: '',
  width: '300px',
});

const emit = defineEmits<{
  click: [MouseEvent];
}>();

const rootStyles = computed(() => ({
  padding: `${parseValue(props.paddingY)}px ${parseValue(props.paddingX)}px`,
  width: `${parseValue(props.width) + parseValue(props.paddingX) * 2}px`,
}));

const captchaStyles = computed(() => {
  return {
    height: `${parseValue(props.height)}px`,
    width: `${parseValue(props.width)}px`,
  };
});

function handleClick(e: MouseEvent) {
  emit('click', e);
}
</script>
<template>
  <Card :style="rootStyles" aria-labelledby="captcha-title" role="region">
    <CardHeader class="p-0">
      <CardTitle id="captcha-title" class="flex items-center justify-between">
        <span>{{ title }}</span>
        <div class="flex items-center justify-end">
          <slot name="extra"></slot>
        </div>
      </CardTitle>
    </CardHeader>
    <CardContent class="relative mt-2 flex w-full overflow-hidden rounded p-0">
      <img
        v-show="captchaImage"
        :src="captchaImage"
        :style="captchaStyles"
        alt="验证码图片（支持img标签src属性值）"
        class="relative z-10"
        @click="handleClick"
      />
      <div class="absolute inset-0">
        <slot></slot>
      </div>
    </CardContent>
    <CardFooter class="mt-2 flex justify-between p-0">
      <slot name="footer"></slot>
    </CardFooter>
  </Card>
</template>
