<script setup lang="ts">
import { Page } from '@vben/common-ui';

import { VbenContextMenu } from '@vben-core/shadcn-ui';

import { Button, Card, message } from 'ant-design-vue';

const needHidden = (role: string) => {
  return role === 'user';
};

const contextMenus = () => {
  return [
    {
      text: '刷新',
      key: 'refresh',
      handler: (data: any) => {
        message.success('刷新成功', data);
      },
      hidden: needHidden('admin'),
    },
    {
      text: '关闭当前',
      key: 'close-current',
      handler: (data: any) => {
        message.success('关闭当前', data);
      },
      hidden: needHidden('user'),
    },
    {
      text: '关闭其他',
      key: 'close-other',
      handler: (data: any) => {
        message.success('关闭其他', data);
      },
    },
    {
      text: '关闭所有',
      key: 'close-all',
      handler: (data: any) => {
        message.success('关闭所有', data);
      },
    },
  ];
};

</script>

<template>
  <Page title="Context Menu 上下文菜单">
    <Card title="基本使用">
      <div>一共四个菜单（刷新、关闭当前、关闭其他、关闭所有）</div>
      <br/>
      <br/>
      <VbenContextMenu :menus="contextMenus" :modal="true" item-class="pr-6">
        <Button> 右键点击我打开上下文菜单(有隐藏项) </Button>
      </VbenContextMenu>
    </Card>
  </Page>
</template>
