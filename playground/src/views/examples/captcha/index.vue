<script lang="ts" setup>
import type { CaptchaPoint } from '@vben/common-ui';

import { reactive, ref } from 'vue';

import { Page, PointSelectionCaptcha } from '@vben/common-ui';

import { Card, Input, InputNumber, message, Switch } from 'ant-design-vue';

import { captchaImage, hintImage } from './base64';

const selectedPoints = ref<CaptchaPoint[]>([]);
const params = reactive({
  captchaImage,
  captchaImageUrl: '',
  height: undefined,
  hintImage,
  hintImageUrl: '',
  hintText: '唇，燕，碴，找',
  paddingX: undefined,
  paddingY: undefined,
  showConfirm: true,
  showHintImage: true,
  title: '请完成安全验证',
  width: undefined,
});
const handleConfirm = (points: CaptchaPoint[], clear: () => void) => {
  message.success({
    content: `captcha points: ${JSON.stringify(points)}`,
  });
  clear();
};
const handleRefresh = () => {
  selectedPoints.value = [];
};
const handleClick = (point: CaptchaPoint) => {
  selectedPoints.value.push(point);
};
</script>

<template>
  <Page
    description="通过点击图片中的特定位置来验证用户身份。"
    title="验证码组件示例"
  >
    <Card class="mb-4" title="基本使用">
      <div class="mb-3 flex items-center justify-start">
        <Input
          v-model:value="params.title"
          class="w-64"
          placeholder="验证码标题文案"
        />
        <Input
          v-model:value="params.captchaImageUrl"
          class="ml-8 w-64"
          placeholder="验证码图片（支持img标签src属性值）"
        />
        <div class="ml-8 flex w-96 items-center">
          <Switch
            v-model:checked="params.showHintImage"
            checked-children="提示图片"
            class="mr-4 w-40"
            un-checked-children="提示文本"
          />
          <Input
            v-show="params.showHintImage"
            v-model:value="params.hintImageUrl"
            placeholder="提示图片（支持img标签src属性值）"
          />
          <Input
            v-show="!params.showHintImage"
            v-model:value="params.hintText"
            placeholder="提示文本"
          />
        </div>

        <Switch
          v-model:checked="params.showConfirm"
          checked-children="展示确认"
          class="ml-8 w-28"
          un-checked-children="隐藏确认"
        />
      </div>
      <div class="mb-3 flex items-center justify-start">
        <div>
          <InputNumber
            v-model:value="params.width"
            :min="1"
            :precision="0"
            :step="1"
            class="w-64"
            placeholder="验证码图片宽度 默认300px"
          >
            <template #addonAfter>px</template>
          </InputNumber>
        </div>
        <div class="ml-8">
          <InputNumber
            v-model:value="params.height"
            :min="1"
            :precision="0"
            :step="1"
            class="w-64"
            placeholder="验证码图片高度 默认220px"
          >
            <template #addonAfter>px</template>
          </InputNumber>
        </div>
        <div class="ml-8">
          <InputNumber
            v-model:value="params.paddingX"
            :min="1"
            :precision="0"
            :step="1"
            class="w-64"
            placeholder="水平内边距 默认12px"
          >
            <template #addonAfter>px</template>
          </InputNumber>
        </div>
        <div class="ml-8">
          <InputNumber
            v-model:value="params.paddingY"
            :min="1"
            :precision="0"
            :step="1"
            class="w-64"
            placeholder="垂直内边距 默认16px"
          >
            <template #addonAfter>px</template>
          </InputNumber>
        </div>
      </div>

      <PointSelectionCaptcha
        :captcha-image="params.captchaImageUrl || params.captchaImage"
        :height="params.height || 220"
        :hint-image="
          params.showHintImage ? params.hintImageUrl || params.hintImage : ''
        "
        :hint-text="params.hintText"
        :padding-x="params.paddingX"
        :padding-y="params.paddingY"
        :show-confirm="params.showConfirm"
        :title="params.title"
        :width="params.width || 300"
        class="float-left"
        @click="handleClick"
        @confirm="handleConfirm"
        @refresh="handleRefresh"
      />
      <ol class="float-left p-5">
        <li v-for="point in selectedPoints" :key="point.i" class="flex">
          <span class="mr-3 w-16">索引：{{ point.i }}</span>
          <span class="mr-3 w-44">时间戳：{{ point.t }}</span>
          <span class="mr-3 w-16">x：{{ point.x }}</span>
          <span class="mr-3 w-16">y：{{ point.y }}</span>
        </li>
      </ol>
    </Card>
  </Page>
</template>
