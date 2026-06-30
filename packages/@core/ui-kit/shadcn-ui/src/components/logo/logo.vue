<script setup lang="ts">
import { computed } from 'vue';

import { VbenAvatar } from '../avatar';

interface Props {
  /**
   * @zh_CN 是否收起文本；布局状态，侧边栏收起时隐藏文字。
   */
  collapsed?: boolean;
  /**
   * @zh_CN Logo 图片适应方式
   */
  fit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  /**
   * @zh_CN logo高度， 只在 logoMode=full时失效
   */
  fullLogoHeight?: number | string;
  /**
   * @zh_CN Logo 跳转地址
   */
  href?: string;
  /**
   * @zh_CN logo 展示类型，icon 图标模式， full 铺满logo区域
   */
  logoMode?: 'full' | 'icon';
  /**
   * @zh_CN Logo 图片大小
   */
  logoSize?: number;
  /**
   * @zh_CN Logo 是否展示文本
   */
  showText?: boolean;
  /**
   * @zh_CN Logo 图标
   */
  src?: string;
  /**
   * @zh_CN 暗色主题 Logo 图标 (可选，若不设置则使用 src)
   */
  srcDark?: string;

  /**
   * @zh_CN Logo 文本
   */
  text: string;

  /**
   * @zh_CN Logo 主题
   */
  theme?: string;
}

defineOptions({
  name: 'VbenLogo',
});

const props = withDefaults(defineProps<Props>(), {
  collapsed: false,
  href: 'javascript:void 0',
  logoMode: 'icon',
  logoSize: 32,
  fullLogoHeight: 42,
  src: '',
  srcDark: '',
  theme: 'light',
  fit: 'cover',
  showText: true,
});

/**
 * @zh_CN 根据主题选择合适的 logo 图标
 */
const logoSrc = computed(() => {
  // 如果是暗色主题且提供了 srcDark，则使用暗色主题的 logo
  if (props.theme === 'dark' && props.srcDark) {
    return props.srcDark;
  }
  // 否则使用默认的 src
  return props.src;
});

/**
 * @zh_CN 是否铺满容器显示log
 */
const shouldUseFullLogo = computed(() => {
  return props.logoMode === 'full' && !props.collapsed;
});

/**
 * @zh_CN 根据配置展示 logo text
 */
const shouldShowText = computed(() => {
  return (
    props.showText &&
    !props.collapsed &&
    !shouldUseFullLogo.value &&
    !!props.text
  );
});

/**
 * @zh_CN full 模式下logo的样式
 */
const fullLogoStyle = computed(() => ({
  height:
    typeof props.fullLogoHeight === 'number'
      ? `${props.fullLogoHeight}px`
      : props.fullLogoHeight,
  objectFit: props.fit,
}));
</script>

<template>
  <div :class="theme" class="flex h-full items-center text-lg">
    <a
      :class="[
        $attrs.class,
        shouldShowText
          ? 'gap-2 px-3 justify-start'
          : 'w-full p-0 justify-center',
      ]"
      :href="href"
      class="flex h-full items-center overflow-hidden text-lg leading-normal transition-all duration-500"
    >
      <img
        v-if="logoSrc && shouldUseFullLogo"
        :alt="text"
        :src="logoSrc"
        :style="fullLogoStyle"
        class="w-full"
      />

      <VbenAvatar
        v-else-if="logoSrc"
        :alt="text"
        :src="logoSrc"
        :size="logoSize"
        :fit="fit"
        class="relative rounded-none bg-transparent"
      />
      <template v-if="shouldShowText">
        <slot name="text">
          <span class="text-foreground truncate font-semibold text-nowrap">
            {{ text }}
          </span>
        </slot>
      </template>
    </a>
  </div>
</template>
