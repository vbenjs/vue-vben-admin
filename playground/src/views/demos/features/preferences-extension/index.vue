<script lang="ts" setup>
import type { PlaygroundPreferencesExtension } from '#/preferences';

import { computed } from 'vue';

import { Page } from '@vben/common-ui';
import {
  getCustomPreferences,
  updateCustomPreferences,
} from '@vben/preferences';

import { Alert, Button, Card, Space, Tag } from 'ant-design-vue';

import { $t } from '#/locales';

interface DemoTaskItem {
  id: number;
  owner: string;
  priority: 'P0' | 'P1' | 'P2';
  title: string;
}

type HighlightTone = PlaygroundPreferencesExtension['highlightTone'];

const playgroundPreferences =
  getCustomPreferences<PlaygroundPreferencesExtension>();

const demoTasks: DemoTaskItem[] = [
  { id: 1, owner: 'Luna', priority: 'P0', title: '同步租户配置到缓存' },
  { id: 2, owner: 'Aiden', priority: 'P1', title: '补充角色权限回归用例' },
  { id: 3, owner: 'Mia', priority: 'P0', title: '修复看板接口超时重试' },
  { id: 4, owner: 'Noah', priority: 'P2', title: '整理本周运营周报模板' },
  { id: 5, owner: 'Ethan', priority: 'P1', title: '验证暗黑主题下图表对比度' },
  { id: 6, owner: 'Sophia', priority: 'P1', title: '更新埋点字段映射文档' },
  { id: 7, owner: 'Lucas', priority: 'P2', title: '检查消息中心未读状态同步' },
  { id: 8, owner: 'Emma', priority: 'P0', title: '补齐导出任务失败告警' },
];

const toneMap = {
  default: {
    alertType: 'info',
    cardClass: 'border-primary/20 bg-primary/5',
    label: $t('demos.preferencesExtensionDemo.tones.default'),
    tagColor: 'processing',
  },
  success: {
    alertType: 'success',
    cardClass: 'border-emerald-500/20 bg-emerald-500/5',
    label: $t('demos.preferencesExtensionDemo.tones.success'),
    tagColor: 'success',
  },
  warning: {
    alertType: 'warning',
    cardClass: 'border-amber-500/20 bg-amber-500/5',
    label: $t('demos.preferencesExtensionDemo.tones.warning'),
    tagColor: 'warning',
  },
} as const satisfies Record<
  HighlightTone,
  {
    alertType: 'info' | 'success' | 'warning';
    cardClass: string;
    label: string;
    tagColor: string;
  }
>;

const visibleTasks = computed(() => {
  return demoTasks.slice(0, playgroundPreferences.defaultVisibleRows);
});

const toneConfig = computed(() => {
  return toneMap[playgroundPreferences.highlightTone];
});

const formattedPlaygroundPreferences = computed(() => {
  return JSON.stringify(playgroundPreferences, null, 2);
});

const preClasses =
  'mt-4 overflow-auto rounded-lg border border-border bg-muted p-4 text-sm';

function applyPreset(type: 'compact' | 'focus' | 'review') {
  const presetMap: Record<
    typeof type,
    Partial<PlaygroundPreferencesExtension>
  > = {
    compact: {
      defaultVisibleRows: 3,
      enableQuickActions: false,
      highlightTone: 'warning',
      reportTitle: $t('demos.preferencesExtensionDemo.presetTitles.compact'),
    },
    focus: {
      defaultVisibleRows: 4,
      enableQuickActions: true,
      highlightTone: 'default',
      reportTitle: $t('demos.preferencesExtensionDemo.presetTitles.default'),
    },
    review: {
      defaultVisibleRows: 6,
      enableQuickActions: true,
      highlightTone: 'success',
      reportTitle: $t('demos.preferencesExtensionDemo.presetTitles.review'),
    },
  };

  updateCustomPreferences<PlaygroundPreferencesExtension>(presetMap[type]);
}

function getPriorityColor(priority: DemoTaskItem['priority']) {
  switch (priority) {
    case 'P0': {
      return 'error';
    }
    case 'P1': {
      return 'warning';
    }
    default: {
      return 'default';
    }
  }
}
</script>

<template>
  <Page :title="$t('demos.features.preferencesExtension')">
    <template #description>
      <div class="mt-2 text-foreground/80">
        {{ $t('demos.preferencesExtensionDemo.description') }}
      </div>
    </template>

    <Card
      class="mb-5"
      :title="$t('demos.preferencesExtensionDemo.currentConfig')"
    >
      <Alert :type="toneConfig.alertType" show-icon>
        <template #message>
          {{
            $t('demos.preferencesExtensionDemo.currentTitle', {
              title: playgroundPreferences.reportTitle,
            })
          }}
        </template>
        <template #description>
          {{
            $t('demos.preferencesExtensionDemo.currentDescription', {
              count: playgroundPreferences.defaultVisibleRows,
              quickActionText: playgroundPreferences.enableQuickActions
                ? $t('demos.preferencesExtensionDemo.showQuickActions')
                : $t('demos.preferencesExtensionDemo.hideQuickActions'),
              tone: toneConfig.label,
            })
          }}
        </template>
      </Alert>

      <div class="mt-4 rounded-xl border p-4" :class="toneConfig.cardClass">
        <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div class="text-lg font-semibold">
              {{ playgroundPreferences.reportTitle }}
            </div>
            <div class="text-sm text-foreground/60">
              {{ $t('demos.preferencesExtensionDemo.boardDescription') }}
            </div>
          </div>
          <Tag :color="toneConfig.tagColor">
            {{ toneConfig.label }}
          </Tag>
        </div>

        <Space
          v-if="playgroundPreferences.enableQuickActions"
          wrap
          class="mb-4"
        >
          <Button type="primary">
            {{ $t('demos.preferencesExtensionDemo.quickActions.create') }}
          </Button>
          <Button>
            {{ $t('demos.preferencesExtensionDemo.quickActions.export') }}
          </Button>
          <Button>
            {{ $t('demos.preferencesExtensionDemo.quickActions.refresh') }}
          </Button>
        </Space>
        <div v-else class="mb-4 text-sm text-foreground/60">
          {{ $t('demos.preferencesExtensionDemo.quickActionsEnabled') }}
        </div>

        <div class="space-y-2">
          <div
            v-for="task in visibleTasks"
            :key="task.id"
            class="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-background px-4 py-3"
          >
            <div>
              <div class="font-medium">{{ task.title }}</div>
              <div class="text-sm text-foreground/60">
                {{ $t('demos.preferencesExtensionDemo.owner') }}：{{
                  task.owner
                }}
              </div>
            </div>
            <Tag :color="getPriorityColor(task.priority)">
              {{ task.priority }}
            </Tag>
          </div>
        </div>
      </div>
    </Card>

    <Card :title="$t('demos.preferencesExtensionDemo.presetTitle')">
      <Space wrap>
        <Button @click="applyPreset('focus')">
          {{ $t('demos.preferencesExtensionDemo.presetButtons.default') }}
        </Button>
        <Button @click="applyPreset('compact')">
          {{ $t('demos.preferencesExtensionDemo.presetButtons.compact') }}
        </Button>
        <Button type="primary" @click="applyPreset('review')">
          {{ $t('demos.preferencesExtensionDemo.presetButtons.review') }}
        </Button>
      </Space>

      <pre :class="preClasses">{{ formattedPlaygroundPreferences }}</pre>
    </Card>
  </Page>
</template>
