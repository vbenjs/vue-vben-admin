<script lang="ts" setup>
import type {
  WorkbenchProjectItem,
  WorkbenchQuickNavItem,
} from '@vben/universal-ui';

import {
  WorkbenchHeader,
  WorkbenchProject,
  WorkbenchQuickNav,
} from '@vben/universal-ui';
import { preferences } from '@vben-core/preferences';

import { useAccessStore } from '#/store';

defineOptions({ name: 'Workspace' });

const { userInfo } = useAccessStore();

const projectItems: WorkbenchProjectItem[] = [
  {
    color: '',
    content: '不要等待机会，而要创造机会。',
    date: '2021-04-01',
    group: '开源组',
    icon: 'carbon:logo-github',
    title: 'Github',
  },
  {
    color: '#3fb27f',
    content: '现在的你决定将来的你。',
    date: '2021-04-01',
    group: '算法组',
    icon: 'ion:logo-vue',
    title: 'Vue',
  },
  {
    color: '#e18525',
    content: '没有什么才能比努力更重要。',
    date: '2021-04-01',
    group: '上班摸鱼',
    icon: 'ion:logo-html5',
    title: 'Html5',
  },
  {
    color: '#bf0c2c',
    content: '热情和欲望可以突破一切难关。',
    date: '2021-04-01',
    group: 'UI',
    icon: 'ion:logo-angular',
    title: 'Angular',
  },
  {
    color: '#00d8ff',
    content: '健康的身体是实现目标的基石。',
    date: '2021-04-01',
    group: '技术牛',
    icon: 'bx:bxl-react',
    title: 'React',
  },
  {
    color: '#EBD94E',
    content: '路是走出来的，而不是空想出来的。',
    date: '2021-04-01',
    group: '架构组',
    icon: 'ion:logo-javascript',
    title: 'Js',
  },
];

const quickNavItems: WorkbenchQuickNavItem[] = [
  {
    color: '#1fdaca',
    icon: 'ion:home-outline',
    title: '首页',
  },
  {
    color: '#bf0c2c',
    icon: 'ion:grid-outline',
    title: '仪表盘',
  },
  {
    color: '#e18525',
    icon: 'ion:layers-outline',
    title: '组件',
  },
  {
    color: '#3fb27f',
    icon: 'ion:settings-outline',
    title: '系统管理',
  },
  {
    color: '#4daf1bc9',
    icon: 'ion:key-outline',
    title: '权限管理',
  },
  {
    color: '#00d8ff',
    icon: 'ion:bar-chart-outline',
    title: '图表',
  },
];
</script>

<template>
  <div class="p-5">
    <WorkbenchHeader
      :avatar="userInfo?.avatar || preferences.app.defaultAvatar"
    >
      <template #title>
        早安, {{ userInfo?.realName }}, 开始您一天的工作吧！
      </template>
      <template #description> 今日晴，20℃ - 32℃！ </template>
    </WorkbenchHeader>

    <div class="mt-5 flex">
      <div class="mr-4 w-full md:w-2/3">
        <WorkbenchProject :items="projectItems" title="项目" />
      </div>
      <div class="w-full md:w-1/3">
        <WorkbenchQuickNav :items="quickNavItems" title="快捷导航" />
      </div>
    </div>
  </div>
</template>
