<script lang="ts" setup>
import { Page } from '@vben/common-ui';

import {
  ElButton,
  ElCard,
  ElMessage,
  ElNotification,
  ElSpace,
} from 'element-plus';

type NotificationType = 'error' | 'info' | 'success' | 'warning';

function info() {
  ElMessage.info('How many roads must a man walk down');
}

function error() {
  ElMessage.error({
    duration: 2500,
    message: 'Once upon a time you dressed so fine',
  });
}

function warning() {
  ElMessage.warning('How many roads must a man walk down');
}
function success() {
  ElMessage.success(
    'Cause you walked hand in hand With another man in my place',
  );
}

function notify(type: NotificationType) {
  ElNotification({
    duration: 2500,
    message: '说点啥呢',
    type,
  });
}
</script>

<template>
  <Page
    description="支持多语言，主题功能集成切换等"
    title="Element Plus组件使用演示"
  >
    <ElCard class="mb-5">
      <template #header> 按钮 </template>
      <ElSpace>
        <ElButton>Default</ElButton>
        <ElButton type="primary"> Primary </ElButton>
        <ElButton type="info"> Info </ElButton>
        <ElButton type="success"> Success </ElButton>
        <ElButton type="warning"> Warning </ElButton>
        <ElButton type="danger"> Error </ElButton>
      </ElSpace>
    </ElCard>
    <ElCard class="mb-5">
      <template #header> Message </template>
      <ElSpace>
        <ElButton type="info" @click="info"> 信息 </ElButton>
        <ElButton type="danger" @click="error"> 错误 </ElButton>
        <ElButton type="warning" @click="warning"> 警告 </ElButton>
        <ElButton type="success" @click="success"> 成功 </ElButton>
      </ElSpace>
    </ElCard>
    <ElCard class="mb-5">
      <template #header> Notification </template>
      <ElSpace>
        <ElButton type="info" @click="notify('info')"> 信息 </ElButton>
        <ElButton type="danger" @click="notify('error')"> 错误 </ElButton>
        <ElButton type="warning" @click="notify('warning')"> 警告 </ElButton>
        <ElButton type="success" @click="notify('success')"> 成功 </ElButton>
      </ElSpace>
    </ElCard>
  </Page>
</template>
