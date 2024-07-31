<script setup lang="ts">
  import { h } from 'vue';
  import { Modal } from 'ant-design-vue';

  Modal.info({
    title: '新版本发布',
    content: h('div', {}, [h('p', 'Vben Admin v5.0.0 预览版本已发布')]),
    onOk() {
      handleClick();
    },
    okText: '前往体验新版',
  });

  function handleClick() {
    window.open('https://www.vben.pro', '_blank');
  }
</script>
<template>
  <div>
    <a-button type="primary" @click="handleClick">前往体验新版</a-button>
  </div>
</template>
