<script lang="ts" setup>
import type { AnalysisOverviewItem } from '@vben/common-ui';
import type { TabOption } from '@vben/types';

import { defineAsyncComponent } from 'vue';

import {
  AnalysisChartCard,
  AnalysisChartsTabs,
  AnalysisOverview,
} from '@vben/common-ui';
import {
  SvgBellIcon,
  SvgCakeIcon,
  SvgCardIcon,
  SvgDownloadIcon,
} from '@vben/icons';

import AsyncPage from '#/components/AsyncPage/index.vue';

/**
 * 图表子组件使用 defineAsyncComponent 异步加载
 * 将它们从主包中分离为独立 chunk，减少首屏 JS 体积
 */
const AnalyticsTrends = defineAsyncComponent(
  () => import('./analytics-trends.vue'),
);
const AnalyticsVisitsData = defineAsyncComponent(
  () => import('./analytics-visits-data.vue'),
);
const AnalyticsVisitsSales = defineAsyncComponent(
  () => import('./analytics-visits-sales.vue'),
);
const AnalyticsVisitsSource = defineAsyncComponent(
  () => import('./analytics-visits-source.vue'),
);
const AnalyticsVisits = defineAsyncComponent(
  () => import('./analytics-visits.vue'),
);

const overviewItems: AnalysisOverviewItem[] = [
  {
    icon: SvgCardIcon,
    title: '用户量',
    totalTitle: '总用户量',
    totalValue: 120_000,
    value: 2000,
  },
  {
    icon: SvgCakeIcon,
    title: '访问量',
    totalTitle: '总访问量',
    totalValue: 500_000,
    value: 20_000,
  },
  {
    icon: SvgDownloadIcon,
    title: '下载量',
    totalTitle: '总下载量',
    totalValue: 120_000,
    value: 8000,
  },
  {
    icon: SvgBellIcon,
    title: '使用量',
    totalTitle: '总使用量',
    totalValue: 50_000,
    value: 5000,
  },
];

const chartTabs: TabOption[] = [
  {
    label: '流量趋势',
    value: 'trends',
  },
  {
    label: '月访问量',
    value: 'visits',
  },
];
</script>

<template>
  <div class="p-5">
    <AnalysisOverview :items="overviewItems" />
    <AsyncPage :rows="6">
      <AnalysisChartsTabs :tabs="chartTabs" class="mt-5">
        <template #trends>
          <AnalyticsTrends />
        </template>
        <template #visits>
          <AnalyticsVisits />
        </template>
      </AnalysisChartsTabs>
    </AsyncPage>

    <div class="mt-5 w-full md:flex">
      <AnalysisChartCard class="mt-5 md:mr-4 md:mt-0 md:w-1/3" title="访问数量">
        <AsyncPage :rows="3">
          <AnalyticsVisitsData />
        </AsyncPage>
      </AnalysisChartCard>
      <AnalysisChartCard class="mt-5 md:mr-4 md:mt-0 md:w-1/3" title="访问来源">
        <AsyncPage :rows="3">
          <AnalyticsVisitsSource />
        </AsyncPage>
      </AnalysisChartCard>
      <AnalysisChartCard class="mt-5 md:mt-0 md:w-1/3" title="访问来源">
        <AsyncPage :rows="3">
          <AnalyticsVisitsSales />
        </AsyncPage>
      </AnalysisChartCard>
    </div>
  </div>
</template>
