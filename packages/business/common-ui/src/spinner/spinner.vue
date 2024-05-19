<script lang="ts" setup>
import { useNamespace } from '@vben-core/toolkit';

interface Props {
  /**
   * @zh_CN loading状态开启
   */
  spinning: boolean;
}

defineOptions({
  name: 'Spinner',
});

defineProps<Props>();

const { b, e } = useNamespace('spinner');
</script>

<template>
  <div
    :class="[b(), !spinning ? 'hidden' : '']"
    class="flex-center bg-overlay absolute left-0 top-0 size-full backdrop-blur-sm"
  >
    <div :class="e('loader')"></div>
  </div>
</template>

<style lang="scss" scoped>
@import '@vben-core/design/global';

@include b('spinner') {
  @keyframes jump-ani {
    15% {
      border-bottom-right-radius: 3px;
    }

    25% {
      transform: translateY(9px) rotate(22.5deg);
    }

    50% {
      border-bottom-right-radius: 40px;
      transform: translateY(18px) scale(1, 0.9) rotate(45deg);
    }

    75% {
      transform: translateY(9px) rotate(67.5deg);
    }

    100% {
      transform: translateY(0) rotate(90deg);
    }
  }

  @keyframes shadow-ani {
    0%,
    100% {
      transform: scale(1, 1);
    }

    50% {
      transform: scale(1.2, 1);
    }
  }

  @include e('loader') {
    position: relative;
    width: 48px;
    height: 48px;

    &::before {
      position: absolute;
      top: 60px;
      left: 0;
      width: 48px;
      height: 5px;
      content: '';
      background: hsl(var(--color-primary) / 50%);
      border-radius: 50%;
      animation: shadow-ani 0.5s linear infinite;
    }

    &::after {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      content: '';
      background: hsl(var(--color-primary));
      border-radius: 4px;
      animation: jump-ani 0.5s linear infinite;
    }
  }
}
</style>
