<script setup lang="ts">
  import { h } from 'vue';
  import { Modal } from 'ant-design-vue';
  import { useI18n } from '@/hooks/web/useI18n';

  const { t } = useI18n();

  const localKey = 'vben-v5.0.0-upgrade-prompt';

  if (!localStorage.getItem(localKey)) {
    Modal.confirm({
      title: t('layout.header.upgrade-prompt.title'),
      content: h('div', {}, [h('p', t('layout.header.upgrade-prompt.content'))]),
      onOk() {
        handleClick();
      },
      okText: t('layout.header.upgrade-prompt.ok-text'),
      cancelText: t('common.closeText'),
    });
  }
  localStorage.setItem(localKey, String(Date.now()));

  function handleClick() {
    window.open('https://www.vben.pro', '_blank');
  }
</script>
<template>
  <div>
    <a-button type="primary" @click="handleClick">{{
      t('layout.header.upgrade-prompt.ok-text')
    }}</a-button>
  </div>
</template>
