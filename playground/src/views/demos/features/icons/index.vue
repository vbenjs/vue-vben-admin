<script lang="ts" setup>
import { h, ref } from 'vue';

import { IconPicker, Page } from '@vben/common-ui';
import {
  MdiGithub,
  MdiGoogle,
  MdiKeyboardEsc,
  MdiQqchat,
  MdiWechat,
  SvgAvatar1Icon,
  SvgAvatar2Icon,
  SvgAvatar3Icon,
  SvgAvatar4Icon,
  SvgBellIcon,
  SvgCakeIcon,
  SvgCardIcon,
  SvgDownloadIcon,
} from '@vben/icons';

import { Card, Input } from 'ant-design-vue';

const iconValue = ref('ant-design:trademark-outlined');

const inputComponent = h(Input);
</script>

<template>
  <Page title="图标">
    <template #description>
      <div class="text-foreground/80 mt-2">
        图标可在
        <a
          class="text-primary"
          href="https://icon-sets.iconify.design/"
          target="_blank"
        >
          Iconify
        </a>
        中查找，支持多种图标库，如 Material Design, Font Awesome, Jam Icons 等。
      </div>
    </template>

    <Card class="mb-5" title="Iconify">
      <div class="flex items-center gap-5">
        <MdiGithub class="size-8" />
        <MdiGoogle class="size-8 text-red-500" />
        <MdiQqchat class="size-8 text-green-500" />
        <MdiWechat class="size-8" />
        <MdiKeyboardEsc class="size-8" />
      </div>
    </Card>

    <Card class="mb-5" title="Svg Icons">
      <div class="flex items-center gap-5">
        <SvgAvatar1Icon class="size-8" />
        <SvgAvatar2Icon class="size-8 text-red-500" />
        <SvgAvatar3Icon class="size-8 text-green-500" />
        <SvgAvatar4Icon class="size-8" />
        <SvgCakeIcon class="size-8" />
        <SvgBellIcon class="size-8" />
        <SvgCardIcon class="size-8" />
        <SvgDownloadIcon class="size-8" />
      </div>
    </Card>

    <Card class="mb-5" title="Tailwind CSS">
      <div class="flex items-center gap-5 text-3xl">
        <span class="icon-[ant-design--alipay-circle-outlined]"></span>
        <span class="icon-[ant-design--account-book-filled]"></span>
        <span class="icon-[ant-design--container-outlined]"></span>
        <span class="icon-[svg-spinners--wind-toy]"></span>
        <span class="icon-[svg-spinners--blocks-wave]"></span>
        <span class="icon-[line-md--compass-filled-loop]"></span>
      </div>
    </Card>

    <Card class="mb-5" title="图标选择器">
      <div class="mb-5 flex items-center gap-5">
        <span>原始样式(Iconify):</span>
        <IconPicker class="w-[200px]" />
      </div>
      <div class="mb-5 flex items-center gap-5">
        <span>原始样式(svg):</span>
        <IconPicker class="w-[200px]" prefix="svg" />
      </div>
      <div class="mb-5 flex items-center gap-5">
        <span>使用Input:</span>
        <IconPicker :input-component="inputComponent" icon-slot="addonAfter" />
      </div>
      <div class="flex items-center gap-5">
        <span>可手动输入，只能点击图标打开弹窗:</span>
        <Input
          v-model:value="iconValue"
          allow-clear
          placeholder="点击这里选择图标"
          style="width: 300px"
        >
          <template #addonAfter>
            <IconPicker v-model="iconValue" class="w-[200px]" />
          </template>
        </Input>
      </div>
    </Card>
  </Page>
</template>
