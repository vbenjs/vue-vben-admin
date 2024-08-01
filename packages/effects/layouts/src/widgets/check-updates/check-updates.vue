<script setup lang="ts">
import { h, onMounted, onUnmounted, ref } from 'vue';

import { $t } from '@vben/locales';
import { ToastAction, useToast } from '@vben-core/shadcn-ui';

interface Props {
  // 轮训时间，分钟
  checkUpdatesInterval?: number;
}

defineOptions({ name: 'CheckUpdates' });

const props = withDefaults(defineProps<Props>(), {
  checkUpdatesInterval: 1,
});

const lastVersionTag = ref('');
let isCheckingUpdates = false;
const timer = ref<ReturnType<typeof setInterval>>();
const { toast } = useToast();

async function getVersionTag() {
  try {
    if (
      location.hostname === 'localhost' ||
      location.hostname === '127.0.0.1'
    ) {
      return null;
    }
    const response = await fetch('/', {
      cache: 'no-cache',
      method: 'HEAD',
    });

    return (
      response.headers.get('etag') || response.headers.get('last-modified')
    );
  } catch {
    console.error('Failed to fetch version tag');
    return null;
  }
}

async function checkForUpdates() {
  const versionTag = await getVersionTag();
  if (!versionTag) {
    return;
  }

  // 首次运行时不提示更新
  if (!lastVersionTag.value) {
    lastVersionTag.value = versionTag;
    return;
  }

  if (lastVersionTag.value !== versionTag && versionTag) {
    clearInterval(timer.value);
    handleNotice(versionTag);
  }
}
function handleNotice(versionTag: string) {
  const { dismiss } = toast({
    action: h('div', [
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
          class: 'bg-primary hover:bg-primary-hover mx-1',
          onClick: () => {
            lastVersionTag.value = versionTag;
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

function start() {
  // 每5分钟检查一次
  timer.value = setInterval(
    checkForUpdates,
    props.checkUpdatesInterval * 60 * 1000,
  );
}

function handleVisibilitychange() {
  if (document.hidden) {
    stop();
  } else {
    if (!isCheckingUpdates) {
      isCheckingUpdates = true;
      checkForUpdates().finally(() => {
        isCheckingUpdates = false;
        start();
      });
    }
  }
}

function stop() {
  clearInterval(timer.value);
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
