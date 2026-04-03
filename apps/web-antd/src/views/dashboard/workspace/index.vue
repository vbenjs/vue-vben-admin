<script lang="ts" setup>
// @ts-nocheck
import type {
  AnalysisOverviewItem,
  WorkbenchProjectItem,
  WorkbenchQuickNavItem,
  WorkbenchTodoItem,
  WorkbenchTrendItem,
} from '@vben/common-ui';

import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import {
  AnalysisOverview,
  WorkbenchHeader,
  WorkbenchProject,
  WorkbenchQuickNav,
  WorkbenchTodo,
  WorkbenchTrends,
} from '@vben/common-ui';
import {
  SvgBellIcon,
  SvgCakeIcon,
  SvgCardIcon,
  SvgDownloadIcon,
} from '@vben/icons';
import { preferences } from '@vben/preferences';
import { useUserStore } from '@vben/stores';
import { openWindow } from '@vben/utils';

import { sysDashboardApi } from '#/api/core/sys-manage';

const userStore = useUserStore();
const router = useRouter();
const workbenchDescription = ref('');
const organizationSummary = ref<any>({});

const overviewItems = ref<AnalysisOverviewItem[]>([
  {
    icon: SvgCardIcon,
    title: '系统用户',
    totalTitle: '总用户数',
    totalValue: 0,
    value: 0,
  },
  {
    icon: SvgCakeIcon,
    title: '系统角色',
    totalTitle: '总角色数',
    totalValue: 0,
    value: 0,
  },
  {
    icon: SvgDownloadIcon,
    title: '菜单权限',
    totalTitle: '总菜单数',
    totalValue: 0,
    value: 0,
  },
  {
    icon: SvgBellIcon,
    title: '总登录数',
    totalTitle: '历史登录',
    totalValue: 0,
    value: 0,
  },
]);

const projectItems = ref<WorkbenchProjectItem[]>([
  {
    color: '#3fb27f',
    content: 'Vue RISS 核心架构。',
    date: '2025-01-01',
    group: '系统核心',
    icon: 'ion:logo-vue',
    title: 'Vue.js',
    url: 'https://vuejs.org',
  },
  {
    color: '#bf0c2c',
    content: '开箱即用的中后台前端/设计解决方案。',
    date: '2025-01-01',
    group: '架构组',
    icon: 'ion:logo-github',
    title: 'RISS',
    url: 'https://github.com/vbenjs/vue-vben-admin',
  },
  {
    color: '#e18525',
    content: '下一代前端工具链，为开发提供极速响应。',
    date: '2025-01-01',
    group: '开源组',
    icon: 'ion:flash-outline',
    title: 'Vite',
    url: 'https://vitejs.dev',
  },
  {
    color: '#00d8ff',
    content: 'NestJS 是构建高效，可扩展的 Node.js 服务端应用程序的框架。',
    date: '2025-01-01',
    group: '服务端',
    icon: 'ion:logo-nodejs',
    title: 'NestJS',
    url: 'https://nestjs.com',
  },
]);

const quickNavItems = ref<WorkbenchQuickNavItem[]>([
  { color: '#1fdaca', icon: 'ion:home-outline', title: '首页', url: '/' },
  {
    color: '#bf0c2c',
    icon: 'ion:person-outline',
    title: '用户管理',
    url: '/sys/permission/user',
  },
  {
    color: '#e18525',
    icon: 'ion:shield-checkmark-outline',
    title: '角色管理',
    url: '/sys/permission/role',
  },
  {
    color: '#3fb27f',
    icon: 'ion:menu-outline',
    title: '菜单管理',
    url: '/sys/permission/menu',
  },
  {
    color: '#4daf1bc9',
    icon: 'ion:settings-outline',
    title: '基础数据',
    url: '/sys/base-data/dict',
  },
  {
    color: '#00d8ff',
    icon: 'ion:code-working-outline',
    title: '代码生成',
    url: '/sys/gen',
  },
]);

const todoItems = ref<WorkbenchTodoItem[]>([]);
const trendItems = ref<WorkbenchTrendItem[]>([]);

async function fetchDashboardData() {
  try {
    const res = (await sysDashboardApi.getStatistics()) as any;

    if (res?.overview && overviewItems.value.length > 3) {
      overviewItems.value[0]!.totalValue = res.overview.userCount || 0;
      overviewItems.value[0]!.value = res.overview.userCount || 0;
      overviewItems.value[1]!.totalValue = res.overview.roleCount || 0;
      overviewItems.value[1]!.value = res.overview.roleCount || 0;
      overviewItems.value[2]!.totalValue = res.overview.menuCount || 0;
      overviewItems.value[2]!.value = res.overview.menuCount || 0;
      overviewItems.value[3]!.totalValue = res.overview.loginLogCount || 0;
      overviewItems.value[3]!.value = res.overview.loginLogCount || 0;
    }

    if (res?.currentContext) {
      const parts = [];
      if (res.currentContext.tenantName) {
        const tenantLabel = res.currentContext.isDefaultTenant
          ? `${res.currentContext.tenantName}（默认账套）`
          : res.currentContext.tenantName;
        parts.push(`当前账套：${tenantLabel}`);
      }
      if (res.currentContext.fiscalYearLabel) {
        parts.push(`当前年度：${res.currentContext.fiscalYearLabel}`);
      }
      workbenchDescription.value = parts.join(' · ');
    }

    if (res?.organizationSummary) {
      organizationSummary.value = res.organizationSummary;
    }

    if (res?.todoItems) {
      todoItems.value = res.todoItems;
    }
    if (res?.trendItems) {
      trendItems.value = res.trendItems;
    }
  } catch (error) {
    console.error('Failed to load dashboard data:', error);
  }
}

onMounted(() => {
  fetchDashboardData();
});

function navTo(nav: WorkbenchProjectItem | WorkbenchQuickNavItem) {
  if (nav.url?.startsWith('http')) {
    openWindow(nav.url);
    return;
  }
  if (nav.url?.startsWith('/')) {
    router.push(nav.url).catch((error) => {
      console.error('Navigation failed:', error);
    });
  } else {
    console.warn(`Unknown URL for navigation item: ${nav.title} -> ${nav.url}`);
  }
}
</script>

<template>
  <div class="p-5">
    <WorkbenchHeader
      :avatar="userStore.userInfo?.avatar || preferences.app.defaultAvatar"
    >
      <template #title>
        早安, {{ userStore.userInfo?.realName }}, 欢迎使用系统工作台！
      </template>
      <template #description>
        {{
          workbenchDescription ||
          '当前上下文已就绪，系统管理与业务请求会自动携带年度/账套。'
        }}
      </template>
    </WorkbenchHeader>

    <AnalysisOverview :items="overviewItems" class="mt-5" />

    <div
      v-if="organizationSummary?.name"
      class="mt-5 rounded-xl bg-white p-4 shadow-sm dark:bg-[var(--vben-background)]"
    >
      <div class="mb-2 flex items-center justify-between">
        <div class="text-base font-medium">组织参数摘要</div>
        <button
          class="text-sm text-blue-600"
          @click="router.push('/sys/settings/config')"
        >
          前往组织参数设置
        </button>
      </div>
      <div class="flex flex-wrap gap-4 text-sm text-gray-600">
        <span>组织名称：{{ organizationSummary.name || '-' }}</span>
        <span>组织性质：{{ organizationSummary.orgNature || '-' }}</span>
        <span
          >预算来源：{{ organizationSummary.defaultFundSource || '-' }}</span
        >
        <span
          >付款方式：{{ organizationSummary.defaultPaymentMethod || '-' }}</span
        >
        <span
          >辅助维度：{{ organizationSummary.defaultAuxDimension || '-' }}</span
        >
      </div>
    </div>

    <div class="mt-5 flex flex-col lg:flex-row">
      <div class="mr-4 w-full lg:w-3/5">
        <WorkbenchProject :items="projectItems" title="技术栈" @click="navTo" />
        <WorkbenchTrends
          :items="trendItems"
          class="mt-5"
          title="系统最新动态"
        />
      </div>
      <div class="w-full lg:w-2/5">
        <WorkbenchQuickNav
          :items="quickNavItems"
          class="mt-5 lg:mt-0"
          title="快捷导航"
          @click="navTo"
        />
        <WorkbenchTodo :items="todoItems" class="mt-5" title="待办事项" />
      </div>
    </div>
  </div>
</template>
