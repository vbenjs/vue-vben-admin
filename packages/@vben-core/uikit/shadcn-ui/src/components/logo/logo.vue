<script setup lang="ts">
import { computed } from 'vue';

import { VbenAvatar } from '../avatar';

interface Props {
  /**
   * Logo 图标 alt
   */
  alt?: string;
  /**
   * 是否收起文本
   */
  collapse?: boolean;
  /**
   * Logo 跳转地址
   */
  href?: string;
  /**
   * Logo 图片大小
   */
  logoSize?: number;
  /**
   * Logo 图标
   */
  src?: string;
  /**
   * Logo 文本
   */
  text?: string;
  /**
   * Logo 主题
   */
  theme?: string;
}

defineOptions({
  name: 'Logo',
});

const props = withDefaults(defineProps<Props>(), {
  alt: 'Vben',
  collapse: false,
  href: 'javascript:void 0',
  logoSize: 32,
  src: '',
  text: '',
  theme: 'light',
});
const logoClass = computed(() => {
  return [props.theme, props.collapse ? 'collapsed' : ''];
});
</script>

<template>
  <div class="group flex h-full items-center text-lg" :class="logoClass">
    <a
      :href="href"
      class="text-foreground flex h-full items-center gap-2 overflow-hidden px-3 font-semibold leading-normal transition-all duration-500 group-[.dark]:text-[hsl(var(--color-dark-foreground))]"
      :class="$attrs.class"
    >
      <VbenAvatar
        v-if="src"
        :src="src"
        :alt="alt"
        :height="logoSize"
        :width="logoSize"
        class="relative size-9 rounded-none bg-transparent"
      />
      <span v-if="!collapse" class="truncate text-nowrap">
        {{ text }}
        <!-- <span class="text-primary ml-1 align-super text-[smaller]">Pro</span> -->
      </span>
    </a>
  </div>
</template>
