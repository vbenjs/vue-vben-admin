<script lang="ts" setup>
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
</script>

<template>
  <div class="p-5">
    <div class="card-box p-5">
      <h1 class="text-xl font-semibold">图标</h1>
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
    </div>

    <div class="card-box mt-5 p-5">
      <div class="mb-3 text-lg font-semibold">Iconify</div>
      <div class="flex items-center gap-5">
        <MdiGithub class="size-8" />
        <MdiGoogle class="size-8 text-red-500" />
        <MdiQqchat class="size-8 text-green-500" />
        <MdiWechat class="size-8" />
        <MdiKeyboardEsc class="size-8" />
      </div>
    </div>

    <div class="card-box mt-5 p-5">
      <div class="mb-3 text-lg font-semibold">Svg Icons</div>
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
    </div>
  </div>
</template>
