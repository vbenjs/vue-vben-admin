<script lang="ts" setup>
import { Page } from '@vben/common-ui';
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

import { Card } from 'ant-design-vue';

import IconPicker from './icon-picker.vue';
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

    <Card class="mb-5" title="图标选择器(Iconify)">
      <div class="flex items-center gap-5">
        <IconPicker width="300px" />
      </div>
    </Card>

    <Card title="图标选择器(Svg)">
      <div class="flex items-center gap-5">
        <IconPicker prefix="svg" width="300px" />
      </div>
    </Card>
  </Page>
</template>
