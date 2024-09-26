<script setup lang="ts">
import { h, onMounted, onUnmounted, watch } from 'vue';

import { $t } from '@vben/locales';
import { ToastAction, useToast } from '@vben-core/shadcn-ui';

import { createWorker, createWorkFn } from './utils';

interface Props {
  // 轮训时间，分钟
  checkUpdatesInterval?: number;
}

defineOptions({ name: 'CheckUpdates' });

const props = withDefaults(defineProps<Props>(), {
  checkUpdatesInterval: 1,
});
const rootPath = `${location.origin}/`;
const { toast } = useToast();

const opts = {
  checkUpdatesInterval: props.checkUpdatesInterval,
  fetchUrl: rootPath,
  // immediate: false
};
watch(
  () => props.checkUpdatesInterval,
  () => {
    opts.checkUpdatesInterval = props.checkUpdatesInterval;
  },
);
const worker = createWorker(createWorkFn, []);

worker.addEventListener('message', (e: any) => {
  // {type: 'showNotice', data: 'version'}
  if (import.meta.env.MODE === 'production') handleNotice(e.data.data);
});

const start = (immediate = false) => {
  worker.postMessage({ data: { ...opts, immediate }, type: 'start' });
};
const stop = () => {
  worker.postMessage({ type: 'stop' });
};

function handleNotice(/* versionTag: string*/) {
  const { dismiss } = toast({
    action: h('div', { class: 'inline-flex items-center' }, [
      h(
        ToastAction,
        {
          altText: $t('common.cancel'),
          onClick: () => dismiss(),
        },
        {
          default: () => $t('common.cancel'),
        },
      ),
      h(
        ToastAction,
        {
          altText: $t('common.refresh'),
          class:
            'bg-primary text-primary-foreground hover:bg-primary-hover mx-1',
          onClick: () => {
            window.location.reload();
          },
        },
        {
          default: () => $t('common.refresh'),
        },
      ),
    ]),
    description: $t('widgets.checkUpdatesDescription'),
    duration: 0,
    title: $t('widgets.checkUpdatesTitle'),
  });
}

function handleVisibilitychange() {
  if (document.hidden) {
    stop();
  } else {
    start(true);
  }
}

onMounted(() => {
  start();
  document.addEventListener('visibilitychange', handleVisibilitychange);
});

onUnmounted(() => {
  stop();
  document.removeEventListener('visibilitychange', handleVisibilitychange);
});
</script>
<template>
  <slot></slot>
</template>
