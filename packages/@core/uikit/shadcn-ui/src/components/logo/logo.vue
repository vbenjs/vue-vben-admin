<script setup lang="ts">
import { computed } from 'vue';

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
  logoSize: 36,
  src: '',
  text: '',
  theme: 'light',
});
const logoClass = computed(() => {
  return [props.theme, props.collapse ? 'collapsed' : ''];
});
</script>

<template>
  <div :class="logoClass" class="group flex h-full items-center text-lg">
    <a
      :class="$attrs.class"
      :href="href"
      class="flex h-full items-center gap-2 overflow-hidden px-3 font-semibold leading-normal transition-all duration-500"
    >
      <img
        v-if="src"
        :alt="alt"
        :src="src"
        :width="logoSize"
        class="relative rounded-none bg-transparent"
      />
      <span
        v-if="!collapse"
        class="text-primary truncate text-nowrap group-[.dark]:text-[hsl(var(--color-dark-foreground))]"
      >
        {{ text }}
        <!-- <span class="text-primary ml-1 align-super text-[smaller]">Pro</span> -->
      </span>
    </a>
  </div>
</template>
