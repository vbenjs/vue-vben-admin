<template>
  <div class="request-box">
    <a-button @click="handleClick" type="primary"> 点击会重新发起请求5次 </a-button>
    <p>打开浏览器的network面板，可以看到发出了六次请求</p>
  </div>
</template>
<script lang="ts" setup>
  import { testRetry } from '/@/api/sys/user';
  // @ts-ignore
  const handleClick = async () => {
    await testRetry();
  };
</script>

<style lang="less">
  .request-box {
    margin: 50px;
  }

  p {
    margin-top: 10px;
  }
</style>
