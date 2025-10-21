<script setup lang="ts">
import type { AssistantConfig } from '#/types/ai-assistant';

import { Card, Badge } from 'ant-design-vue';
import { computed } from 'vue';

interface Props {
  assistant: AssistantConfig;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
});

const emit = defineEmits<{
  click: [];
}>();

// 格式化使用次数
const formattedUsageCount = computed(() => {
  if (props.assistant.usageCount >= 1000) {
    return `${(props.assistant.usageCount / 1000).toFixed(1)}k`;
  }
  return props.assistant.usageCount.toString();
});

// 格式化最后使用时间
const formattedLastUsed = computed(() => {
  if (!props.assistant.lastUsed) {
    return '从未使用';
  }
  const date = new Date(props.assistant.lastUsed);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return '今天';
  } else if (diffDays === 1) {
    return '昨天';
  } else if (diffDays < 7) {
    return `${diffDays}天前`;
  } else if (diffDays < 30) {
    return `${Math.floor(diffDays / 7)}周前`;
  } else {
    return `${Math.floor(diffDays / 30)}个月前`;
  }
});

const handleClick = () => {
  if (!props.disabled && props.assistant.enabled) {
    emit('click');
  }
};
</script>

<template>
  <Card
    :class="[
      'assistant-card',
      {
        'assistant-card--disabled': disabled || !assistant.enabled,
        'assistant-card--clickable': !disabled && assistant.enabled,
      },
    ]"
    hoverable
    @click="handleClick"
  >
    <template #cover>
      <div class="assistant-card__cover">
        <div class="assistant-card__icon">
          <span class="text-4xl">{{ assistant.icon }}</span>
        </div>
        <Badge
          v-if="!assistant.enabled"
          class="assistant-card__badge"
          status="default"
          text="已禁用"
        />
      </div>
    </template>

    <div class="assistant-card__content">
      <h3 class="assistant-card__title">{{ assistant.name }}</h3>
      <p class="assistant-card__description">{{ assistant.description }}</p>

      <div class="assistant-card__stats">
        <div class="assistant-card__stat-item">
          <div class="stat-value">{{ formattedUsageCount }}</div>
          <div class="stat-label">使用次数</div>
        </div>
        <div class="assistant-card__stat-item">
          <div class="stat-value text-xs">{{ formattedLastUsed }}</div>
          <div class="stat-label">最后使用</div>
        </div>
      </div>
    </div>
  </Card>
</template>

<style scoped>
.assistant-card {
  height: 100%;
  background: hsl(var(--card));
  color: hsl(var(--card-foreground));
  border: 1px solid hsl(var(--border));
  transition: all 0.3s ease;
}

.assistant-card--clickable {
  cursor: pointer;
}

.assistant-card--clickable:hover {
  box-shadow: 0 4px 12px rgb(0 0 0 / 15%);
  transform: translateY(-4px);
}

.assistant-card--disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.assistant-card :deep(.ant-card-body) {
  color: inherit;
}

.assistant-card__cover {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
  background: linear-gradient(
    135deg,
    hsl(var(--primary)) 0%,
    hsl(var(--primary) / 0.8) 100%
  );
}

.assistant-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: hsl(var(--card-foreground) / 0.12);
  border-radius: 50%;
  backdrop-filter: blur(10px);
}

.assistant-card__badge {
  position: absolute;
  top: 12px;
  right: 12px;
}

.assistant-card__content {
  padding: 4px 0;
}

.assistant-card__title {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 600;
  color: hsl(var(--card-foreground));
}

.assistant-card__description {
  min-height: 42px;
  margin: 0 0 16px;
  font-size: 14px;
  line-height: 1.5;
  color: hsl(var(--muted-foreground));
}

.assistant-card__stats {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid hsl(var(--border));
}

.assistant-card__stat-item {
  flex: 1;
  text-align: center;
}

.stat-value {
  margin-bottom: 4px;
  font-size: 18px;
  font-weight: 600;
  color: hsl(var(--card-foreground));
}

.stat-label {
  font-size: 12px;
  color: hsl(var(--muted-foreground));
}
</style>
