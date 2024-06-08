<script setup lang="ts">
import type { FallbackProps } from './fallback';

import { computed } from 'vue';
import { useRouter } from 'vue-router';

import { $t } from '@vben/locales';
import { IcRoundArrowBackIosNew } from '@vben-core/iconify';
import { VbenButton } from '@vben-core/shadcn-ui';

import Icon403 from './icons/icon-403.vue';
import Icon404 from './icons/icon-404.vue';
import Icon500 from './icons/icon-500.vue';

interface Props extends FallbackProps {}

defineOptions({
  name: 'Fallback',
});

const props = withDefaults(defineProps<Props>(), {
  description: '',
  homePath: '/',
  image: '',
  showBack: true,
  status: '404',
  title: '',
});

const titleText = computed(() => {
  if (props.title) {
    return props.title;
  }

  switch (props.status) {
    case '403': {
      return $t('fallback.forbidden');
    }
    case '500': {
      return $t('fallback.internal-error');
    }
    default: {
      return $t('fallback.page-not-found');
    }
  }
});

const descText = computed(() => {
  if (props.description) {
    return props.description;
  }
  switch (props.status) {
    case '403': {
      return $t('fallback.forbidden-desc');
    }
    case '500': {
      return $t('fallback.internal-error-desc');
    }
    default: {
      return $t('fallback.page-not-found-desc');
    }
  }
});

const fallbackIcon = computed(() => {
  switch (props.status) {
    case '403': {
      return Icon403;
    }
    case '500': {
      return Icon500;
    }
    default: {
      return Icon404;
    }
  }
});

const { push } = useRouter();

// 返回首页
function back() {
  push(props.homePath);
}
</script>

<template>
  <div class="flex size-full flex-col items-center justify-center duration-300">
    <img v-if="image" :src="image" class="md:1/3 w-1/2 lg:w-1/4" />
    <component :is="fallbackIcon" v-else class="md:1/3 h-1/3 w-1/2 lg:w-1/4" />
    <div class="flex-col-center">
      <p
        v-if="titleText"
        class="text-foreground mt-12 text-3xl md:text-4xl lg:text-5xl"
      >
        {{ titleText }}
      </p>
      <p
        v-if="descText"
        class="text-muted-foreground md:text-md my-6 lg:text-lg"
      >
        {{ descText }}
      </p>
      <VbenButton v-if="showBack" size="lg" @click="back">
        <IcRoundArrowBackIosNew class="mr-2" />
        {{ $t('common.back-to-home') }}
      </VbenButton>
    </div>
  </div>
</template>
