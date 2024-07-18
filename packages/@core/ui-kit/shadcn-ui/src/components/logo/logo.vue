<script setup lang="ts">
interface Props {
  /**
   * 是否收起文本
   */
  collapsed?: boolean;
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
  text: string;
  /**
   * Logo 主题
   */
  theme?: string;
}

defineOptions({
  name: 'VbenLogo',
});

withDefaults(defineProps<Props>(), {
  collapsed: false,
  href: 'javascript:void 0',
  logoSize: 32,
  src: '',
  theme: 'light',
});
</script>

<template>
  <div :class="theme" class="flex h-full items-center text-lg">
    <a
      :class="$attrs.class"
      :href="href"
      class="flex h-full items-center gap-2 overflow-hidden px-3 text-lg font-semibold leading-normal transition-all duration-500"
    >
      <img
        v-if="src"
        :alt="text"
        :src="src"
        :width="logoSize"
        class="relative rounded-none bg-transparent"
      />
      <span
        v-if="!collapsed"
        class="text-primary dark:text-foreground truncate text-nowrap"
      >
        {{ text }}
      </span>
    </a>
  </div>
</template>
