<script lang="ts" setup>
/**
 * StatusTag - 统一状态标签组件
 * 消除各页面重复的 <Tag :color="...">正常/停用</Tag> 模式
 *
 * 使用: <StatusTag :status="record.status" />
 */
import { computed } from 'vue';

import { Tag } from 'ant-design-vue';

interface Props {
  /** 状态值: '0' = 正常, '1' = 停用 */
  status: string;
  /** 自定义正常状态文案 */
  enabledText?: string;
  /** 自定义停用状态文案 */
  disabledText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  enabledText: '正常',
  disabledText: '停用',
});

const isEnabled = computed(() => props.status === '0');
const tagColor = computed(() => (isEnabled.value ? 'success' : 'error'));
const tagText = computed(() =>
  isEnabled.value ? props.enabledText : props.disabledText,
);
</script>

<template>
  <Tag :color="tagColor">{{ tagText }}</Tag>
</template>
