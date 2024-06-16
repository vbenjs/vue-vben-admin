<script setup lang="ts">
import type { FallbackProps } from './fallback';

import { computed, defineAsyncComponent } from 'vue';
import { useRouter } from 'vue-router';

import { $t } from '@vben/locales';
import { IcRoundArrowBackIosNew, IcRoundRefresh } from '@vben-core/iconify';
import { VbenButton } from '@vben-core/shadcn-ui';

interface Props extends FallbackProps {}

defineOptions({
  name: 'Fallback',
});

const props = withDefaults(defineProps<Props>(), {
  description: '',
  homePath: '/',
  image: '',
  showBack: true,
  status: 'hello',
  title: '',
});

const Icon403 = defineAsyncComponent(() => import('./icons/icon-403.vue'));
const Icon404 = defineAsyncComponent(() => import('./icons/icon-404.vue'));
const Icon500 = defineAsyncComponent(() => import('./icons/icon-500.vue'));
const IconHello = defineAsyncComponent(() => import('./icons/icon-hello.vue'));
const IconOffline = defineAsyncComponent(
  () => import('./icons/icon-offline.vue'),
);

const titleText = computed(() => {
  if (props.title) {
    return props.title;
  }

  switch (props.status) {
    case '403': {
      return $t('fallback.forbidden');
    }
    case '404': {
      return $t('fallback.page-not-found');
    }
    case '500': {
      return $t('fallback.internal-error');
    }
    case 'offline': {
      return $t('fallback.offline-error');
    }
    default: {
      return '';
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
    case '404': {
      return $t('fallback.page-not-found-desc');
    }
    case '500': {
      return $t('fallback.internal-error-desc');
    }
    case 'offline': {
      return $t('fallback.offline-error-desc');
    }
    default: {
      return '';
    }
  }
});

const fallbackIcon = computed(() => {
  switch (props.status) {
    case '403': {
      return Icon403;
    }
    case '404': {
      return Icon404;
    }
    case '500': {
      return Icon500;
    }
    case 'offline': {
      return IconOffline;
    }
    case 'hello': {
      return IconHello;
    }
    default: {
      return null;
    }
  }
});

const showBack = computed(() => {
  return ['403', '404'].includes(props.status);
});

const showRefresh = computed(() => {
  return ['500', 'offline'].includes(props.status);
});

const { push } = useRouter();

// 返回首页
function back() {
  push(props.homePath);
}

function refresh() {
  location.reload();
}
</script>

<template>
  <div class="flex size-full flex-col items-center justify-center duration-300">
    <img v-if="image" :src="image" class="md:1/3 w-1/2 lg:w-1/4" />
    <component
      :is="fallbackIcon"
      v-else-if="fallbackIcon"
      class="md:1/3 h-1/3 w-1/2 lg:w-1/4"
    />
    <div class="flex-col-center">
      <slot v-if="$slots.title" name="title"></slot>
      <p
        v-else-if="titleText"
        class="text-foreground mt-12 text-3xl md:text-4xl lg:text-5xl"
      >
        {{ titleText }}
      </p>
      <slot v-if="$slots.describe" name="describe"></slot>
      <p
        v-else-if="descText"
        class="text-muted-foreground md:text-md my-6 lg:text-lg"
      >
        {{ descText }}
      </p>
      <slot v-if="$slots.action" name="action"></slot>
      <VbenButton v-else-if="showBack" size="lg" @click="back">
        <IcRoundArrowBackIosNew class="mr-2" />
        {{ $t('common.back-to-home') }}
      </VbenButton>
      <VbenButton v-else-if="showRefresh" size="lg" @click="refresh">
        <IcRoundRefresh class="mr-2" />
        {{ $t('common.refresh') }}
      </VbenButton>
    </div>
  </div>
</template>
