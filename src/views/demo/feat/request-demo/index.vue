<template>
  <div class="m-10">
    <a-button @click="handleClick" type="primary"> 点击会重新发起请求5次 </a-button>
    <p class="mt-4">打开浏览器的network面板，可以看到发出了六次请求</p>
  </div>
</template>
<script lang="ts" setup>
  import { testRetry } from '@/api/sys/user';
  // @ts-ignore
  const handleClick = async () => {
    await testRetry();
  };
</script>
