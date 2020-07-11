<template>
  <section class="full-loading">
    <section class="basic-loading">
      <img src="./loading.svg" alt="" class="g-loading" />
      <span class="basic-loading__tip">加载中...</span>
    </section>
  </section>
</template>
<script>
  export default {};
</script>
<style lang="less">
  @keyframes load {
    0% {
      transform: rotate(-360deg);
    }

    100% {
      transform: rotate(0);
    }
  }

  .g-loading {
    max-width: 100px;
    animation: load 2s linear infinite;
    transform-origin: center center;
  }

  .full-loading {
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0, 3);
  }

  .basic-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 64px;
    transform: translate3d(-50%, -50%, 0);
  }

  .basic-loading .basic-loading__tip {
    display: block;
    margin-top: 4px;
    font-size: 13px;
    color: #303133;
    text-align: center;
  }
</style>
