<script lang="ts" setup>
import { Page } from '@vben/common-ui';

import { type NotificationType } from 'naive-ui';
import { NButton, NCard, NSpace, useMessage, useNotification } from 'naive-ui';

const notification = useNotification();

const message = useMessage();
function error() {
  message.error('Once upon a time you dressed so fine');
}

function warning() {
  message.warning('How many roads must a man walk down');
}
function success() {
  message.success('Cause you walked hand in hand With another man in my place');
}
function loading() {
  message.loading(
    'If I were you, I will realize that I love you more than any other guy',
  );
}

function notify(type: NotificationType) {
  notification[type]({
    content: '说点啥呢',
    duration: 2500,
    keepAliveOnHover: true,
    meta: '想不出来',
  });
}
</script>

<template>
  <Page description="支持多语言，主题功能集成切换等" title="naive组件使用演示">
    <NCard class="mb-5" title="按钮">
      <NSpace>
        <NButton>Default</NButton>
        <NButton type="tertiary"> Tertiary </NButton>
        <NButton type="primary"> Primary </NButton>
        <NButton type="info"> Info </NButton>
        <NButton type="success"> Success </NButton>
        <NButton type="warning"> Warning </NButton>
        <NButton type="error"> Error </NButton>
      </NSpace>
    </NCard>

    <NCard class="mb-5" title="Message">
      <NSpace>
        <NButton type="error" @click="error"> 错误 </NButton>
        <NButton type="warning" @click="warning"> 警告 </NButton>
        <NButton type="success" @click="success"> 成功 </NButton>
        <NButton type="primary" @click="loading"> 加载中 </NButton>
      </NSpace>
    </NCard>

    <NCard class="mb-5" title="Notification">
      <NSpace>
        <NButton type="error" @click="notify('error')"> 错误 </NButton>
        <NButton type="warning" @click="notify('warning')"> 警告 </NButton>
        <NButton type="success" @click="notify('success')"> 成功 </NButton>
        <NButton type="primary" @click="notify('info')"> 加载中 </NButton>
      </NSpace>
    </NCard>
  </Page>
</template>
