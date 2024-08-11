<script lang="ts" setup>
import { Button, Card, message, notification, Space } from 'ant-design-vue';

type NotificationType = 'error' | 'info' | 'success' | 'warning';

function info() {
  message.info('How many roads must a man walk down');
}

function error() {
  message.error({
    content: 'Once upon a time you dressed so fine',
    duration: 2500,
  });
}

function warning() {
  message.warning('How many roads must a man walk down');
}
function success() {
  message.success('Cause you walked hand in hand With another man in my place');
}

function notify(type: NotificationType) {
  notification[type]({
    duration: 2500,
    message: '说点啥呢',
    type,
  });
}
</script>

<template>
  <div class="p-5">
    <div class="card-box p-5">
      <h1 class="text-xl font-semibold">Ant Design Vue组件使用演示</h1>
      <div class="text-foreground/80 mt-2">支持多语言，主题功能集成切换等</div>
    </div>

    <div class="card-box mt-5 p-5">
      <div class="mb-3">
        <span class="text-lg font-semibold">按钮</span>
      </div>
      <div>
        <Space>
          <Button>Default</Button>
          <Button type="primary"> Primary </Button>
          <Button> Info </Button>
          <Button danger> Error </Button>
        </Space>
      </div>
    </div>

    <div class="card-box mt-5 p-5">
      <div class="mb-3">
        <span class="text-lg font-semibold">卡片</span>
      </div>
      <div>
        <Card title="卡片"> 卡片内容 </Card>
      </div>
    </div>
    <div class="card-box mt-5 p-5">
      <div class="mb-3">
        <span class="text-lg font-semibold">信息 Message </span>
      </div>
      <div class="flex gap-3">
        <Button @click="info"> 信息 </Button>
        <Button danger @click="error"> 错误 </Button>
        <Button @click="warning"> 警告 </Button>
        <Button @click="success"> 成功 </Button>
      </div>
    </div>

    <div class="card-box mt-5 p-5">
      <div class="mb-3">
        <span class="text-lg font-semibold">通知 Notification </span>
      </div>
      <div class="flex gap-3">
        <Button @click="notify('info')"> 信息 </Button>
        <Button danger @click="notify('error')"> 错误 </Button>
        <Button @click="notify('warning')"> 警告 </Button>
        <Button @click="notify('success')"> 成功 </Button>
      </div>
    </div>
  </div>
</template>
