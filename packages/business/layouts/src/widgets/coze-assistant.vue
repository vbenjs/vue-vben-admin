<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

import { useScriptTag } from '@vueuse/core';

interface AssistantProps {
  botIcon?: string;
  botId?: string;
  botTitle?: string;
  isMobile?: boolean;
}

const props = withDefaults(defineProps<AssistantProps>(), {
  botIcon:
    'https://cdn.jsdelivr.net/npm/@vbenjs/static-source@0.1.3/source/avatar-v1-transparent-bg.webp',
  botId: '7374674983739621392',
  botTitle: 'Vben Admin Assistant',
  isMobile: false,
});

let client: any;
const wrapperEl = ref();

const { load, unload } = useScriptTag(
  'https://sf-cdn.coze.com/obj/unpkg-va/flow-platform/chat-app-sdk/0.1.0-beta.4/libs/oversea/index.js',
  () => {
    client = new (window as any).CozeWebSDK.WebChatClient({
      componentProps: {
        icon: props.botIcon,
        layout: props.isMobile ? 'mobile' : 'pc',
        // lang: 'zh-CN',
        title: props.botTitle,
      },
      config: {
        bot_id: props.botId,
      },
      el: wrapperEl.value,
    });
  },
  {
    manual: true,
  },
);
onMounted(() => {
  load();
});

onUnmounted(() => {
  unload();
  client?.destroy();
});
</script>
<template>
  <div ref="wrapperEl" class="coze-vben-admin-assistant"></div>
</template>

<style>
.coze-vben-admin-assistant {
  position: fixed;
  right: 30px;
  bottom: 60px;
  z-index: 1000;

  img {
    width: 50px !important;
    height: 50px !important;
    border-radius: 50%;
  }
}
</style>
