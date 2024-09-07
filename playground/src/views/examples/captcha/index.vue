<script lang="ts" setup>
import { ref } from 'vue';

import { Page, type Point, PointSelectionCaptcha } from '@vben/common-ui';

import { Card } from 'ant-design-vue';

import { captchaImage, hintImage } from './base64';

const selectedPoints = ref<Point[]>([]);
const handleConfirm = (points: Point[], clear: () => void) => {
  selectedPoints.value = points;
  clear();
};
const handleRefresh = () => {
  selectedPoints.value = [];
};
</script>

<template>
  <Page
    description="通过点击图片中的特定位置来验证用户身份。"
    title="验证码组件示例"
  >
    <Card class="mb-4" title="基本使用">
      <PointSelectionCaptcha
        :captcha-image="captchaImage"
        :hint-image="hintImage"
        class="float-left"
        @confirm="handleConfirm"
        @refresh="handleRefresh"
      />
      <div class="float-left p-5">
        <div v-for="point in selectedPoints" :key="point.i" class="flex">
          <span class="mr-3 w-16">索引：{{ point.i }}</span>
          <span class="mr-3 w-44">时间戳：{{ point.t }}</span>
          <span class="mr-3 w-16">x：{{ point.x }}</span>
          <span class="mr-3 w-16">y：{{ point.y }}</span>
        </div>
      </div>
    </Card>
  </Page>
</template>
