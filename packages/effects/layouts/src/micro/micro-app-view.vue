<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import microApp from '@micro-zoe/micro-app';
// import { EventCenterForMicroApp } from '@micro-zoe/micro-app';

const router = useRouter();
interface IMicro {
  name: string;
  hash: string;
  host: string;
  baseroute: string;
  [key: string]: any;
}

const microData = computed<IMicro | null>(() => {
  const { meta } = router.currentRoute.value;
  if (meta && meta.micro) {
    const { name, hash, host, baseroute } = meta.micro;
    if (!name || !hash || !host || !baseroute) {
      console.error('检查 meta.micro 参数:', meta.micro);
      return null;
    }
    return { name, AppName: name, hash, host, baseroute };
  }
  return null;
});
</script>
<template>
  <Page class="h-1/1 micro-view !m-0 !p-0">
    <micro-app
      v-if="microData"
      :baseroute="microData.baseroute"
      :data="microData"
      :level="2"
      :name="microData.name"
      :url="microData.host"
    />
    <div v-else class="flex h-full flex-col justify-center">
      <p class="mt-2">{{ JSON.stringify(microData) }}</p>
      <p class="mt-2">子服务 加载异常</p>
      <p class="mt-2">异常详情在控制台查看</p>
    </div>
  </Page>
</template>
<style lang="less">
.micro-view {
  & > div {
    padding: 0 !important;
    margin: 0 !important;
  }
}
</style>
