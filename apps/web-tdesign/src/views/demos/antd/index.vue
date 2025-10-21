<script lang="ts" setup>
import { Page } from '@vben/common-ui';

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
  <Page
    description="支持多语言，主题功能集成切换等"
    title="Ant Design Vue组件使用演示"
  >
    <Card class="mb-5" title="按钮">
      <Space>
        <Button>Default</Button>
        <Button type="primary"> Primary </Button>
        <Button> Info </Button>
        <Button danger> Error </Button>
      </Space>
    </Card>
    <Card class="mb-5" title="Message">
      <Space>
        <Button @click="info"> 信息 </Button>
        <Button danger @click="error"> 错误 </Button>
        <Button @click="warning"> 警告 </Button>
        <Button @click="success"> 成功 </Button>
      </Space>
    </Card>

    <Card class="mb-5" title="Notification">
      <Space>
        <Button @click="notify('info')"> 信息 </Button>
        <Button danger @click="notify('error')"> 错误 </Button>
        <Button @click="notify('warning')"> 警告 </Button>
        <Button @click="notify('success')"> 成功 </Button>
      </Space>
    </Card>
  </Page>
</template>
