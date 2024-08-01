<script lang="ts" setup>
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
    "'Cause you walked hand in hand With another man in my place",
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
  <div class="p-5">
    <div class="card-box p-5">
      <h1 class="text-xl font-semibold">Element Plus组件使用演示</h1>
      <div class="text-foreground/80 mt-2">支持多语言，主题功能集成切换等</div>
    </div>

    <div class="card-box mt-5 p-5">
      <div class="mb-3">
        <span class="text-lg font-semibold">按钮</span>
      </div>
      <div>
        <ElSpace>
          <ElButton>Default</ElButton>
          <ElButton type="primary"> Primary </ElButton>
          <ElButton type="info"> Info </ElButton>
          <ElButton type="success"> Success </ElButton>
          <ElButton type="warning"> Warning </ElButton>
          <ElButton type="danger"> Error </ElButton>
        </ElSpace>
      </div>
    </div>

    <div class="card-box mt-5 p-5">
      <div class="mb-3">
        <span class="text-lg font-semibold">卡片</span>
      </div>
      <div>
        <ElCard title="卡片"> 卡片内容 </ElCard>
      </div>
    </div>
    <div class="card-box mt-5 p-5">
      <div class="mb-3">
        <span class="text-lg font-semibold">信息 Message </span>
      </div>
      <div class="flex gap-3">
        <ElButton type="info" @click="info"> 信息 </ElButton>
        <ElButton type="danger" @click="error"> 错误 </ElButton>
        <ElButton type="warning" @click="warning"> 警告 </ElButton>
        <ElButton type="success" @click="success"> 成功 </ElButton>
      </div>
    </div>

    <div class="card-box mt-5 p-5">
      <div class="mb-3">
        <span class="text-lg font-semibold">通知 Notification </span>
      </div>
      <div class="flex gap-3">
        <ElButton type="info" @click="notify('info')"> 信息 </ElButton>
        <ElButton type="danger" @click="notify('error')"> 错误 </ElButton>
        <ElButton type="warning" @click="notify('warning')"> 警告 </ElButton>
        <ElButton type="success" @click="notify('success')"> 成功 </ElButton>
      </div>
    </div>
  </div>
</template>
