<script setup lang="ts">
import { IcRoundArrowBackIosNew } from '@vben-core/iconify';
import { VbenButton } from '@vben-core/shadcn-ui';

import { $t } from '@vben/locales';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

import FeedbackIcon from './fallback-icon.vue';

interface Props {
  /**
   * 描述
   */
  description?: string;
  /**
   *  @zh_CN 首页路由地址
   *  @default /
   */
  homePath?: string;
  /**
   * @zh_CN 默认显示的图片
   * @default pageNotFoundSvg
   */
  image?: string;

  /**
   *  @zh_CN 页面提示语
   */
  title?: string;
}

defineOptions({
  name: 'Fallback',
});

const props = withDefaults(defineProps<Props>(), {
  description: '',
  homePath: '/',
  image: '',
  title: '',
});

const titleText = computed(() => {
  return props.title || $t('fallback.page-not-found');
});

const descText = computed(() => {
  return props.description || $t('fallback.page-not-found-desc');
});

const { push } = useRouter();

// 返回首页
function back() {
  push(props.homePath);
}
</script>

<template>
  <div
    class="-enter-x flex h-screen w-full flex-col items-center justify-center"
  >
    <img v-if="image" :src="image" class="md:1/3 w-1/2 lg:w-1/4" />
    <FeedbackIcon v-else class="md:1/3 h-1/3 w-1/2 lg:w-1/4" />
    <div class="flex flex-col items-center justify-center">
      <p class="text-foreground mt-12 text-3xl md:text-4xl lg:text-5xl">
        {{ titleText }}
      </p>
      <p class="text-muted-foreground my-8 md:text-lg lg:text-xl">
        {{ descText }}
      </p>
      <VbenButton size="lg" @click="back">
        <IcRoundArrowBackIosNew class="mr-2" />
        {{ $t('common.back-to-home') }}
      </VbenButton>
    </div>
  </div>
</template>
