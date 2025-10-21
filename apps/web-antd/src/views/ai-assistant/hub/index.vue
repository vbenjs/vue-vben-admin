<script setup lang="ts">
import type { AssistantConfig, AssistantType } from '#/types/ai-assistant';

import { getAssistantConfigsApi } from '#/api/ai-assistant';
import AssistantCard from '../components/AssistantCard.vue';

import { Row, Col, Spin, Empty, Input, Select, Alert } from 'ant-design-vue';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@vben/stores';
import { Search } from '@vben/icons';

const router = useRouter();
const userStore = useUserStore();

// 状态管理
const loading = ref(false);
const assistants = ref<AssistantConfig[]>([]);
const error = ref<string | null>(null);
const searchQuery = ref('');
const filterType = ref<AssistantType | 'all'>('all');

// 助手类型选项
const assistantTypeOptions = [
  { label: '全部', value: 'all' },
  { label: '文档编辑', value: 'document' },
  { label: '视频编辑', value: 'video' },
  { label: '财务分析', value: 'financial' },
  { label: '技术支持', value: 'technical' },
  { label: '法律审查', value: 'legal' },
];

// 检查用户是否有权限访问某个助手
const hasPermission = (permissions: string[]) => {
  // 如果没有权限要求,则所有人都可以访问
  if (!permissions || permissions.length === 0) {
    return true;
  }

  // 获取用户的权限代码
  const userPermissions = userStore.userInfo?.roles || [];

  // 检查用户是否有任一所需权限
  return permissions.some((permission) =>
    userPermissions.some((role: any) => role === permission || role.code === permission),
  );
};

// 过滤后的助手列表
const filteredAssistants = computed(() => {
  let result = assistants.value;

  // 按权限过滤 - 只显示用户有权限访问的助手
  result = result.filter((a) => hasPermission(a.permissions));

  // 按类型过滤
  if (filterType.value !== 'all') {
    result = result.filter((a) => a.type === filterType.value);
  }

  // 按搜索关键词过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (a) =>
        a.name.toLowerCase().includes(query) ||
        a.description.toLowerCase().includes(query),
    );
  }

  return result;
});

// 获取助手配置列表
const fetchAssistants = async () => {
  loading.value = true;
  error.value = null;

  try {
    // 临时使用Mock数据,等后端API准备好后再切换
    // const response = await getAssistantConfigsApi();
    
    // Mock数据
    const mockAssistants: AssistantConfig[] = [
      {
        id: '1',
        type: 'document',
        name: '文档编辑助手',
        description: '智能文档编辑、结构优化、多语言翻译和合规性检查',
        icon: '📝',
        difyUrl: 'https://dify.example.com/document',
        permissions: [],
        enabled: true,
        usageCount: 1250,
        lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2小时前
        settings: {
          maxFileSize: 10485760,
          allowedFileTypes: ['.doc', '.docx', '.pdf'],
          maxConversationLength: 100,
          enableQualityControl: true,
          enableFeedback: true,
        },
      },
      {
        id: '2',
        type: 'video',
        name: '视频编辑助手',
        description: '自动视频编辑、智能字幕生成、背景音乐推荐',
        icon: '🎬',
        difyUrl: 'https://dify.example.com/video',
        permissions: [],
        enabled: true,
        usageCount: 856,
        lastUsed: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1天前
        settings: {
          maxFileSize: 104857600,
          allowedFileTypes: ['.mp4', '.avi', '.mov'],
          maxConversationLength: 50,
          enableQualityControl: true,
          enableFeedback: true,
        },
      },
      {
        id: '3',
        type: 'financial',
        name: '财务分析助手',
        description: '财务数据分析、趋势预测、异常检测和报表生成',
        icon: '💰',
        difyUrl: 'https://dify.example.com/financial',
        permissions: [],
        enabled: true,
        usageCount: 2340,
        lastUsed: new Date(Date.now() - 30 * 60 * 1000), // 30分钟前
        settings: {
          maxFileSize: 5242880,
          allowedFileTypes: ['.xlsx', '.csv'],
          maxConversationLength: 100,
          enableQualityControl: true,
          enableFeedback: true,
        },
      },
      {
        id: '4',
        type: 'technical',
        name: '技术支持助手',
        description: '技术问题解答、代码示例、文档检索和故障排查',
        icon: '🔧',
        difyUrl: 'https://dify.example.com/technical',
        permissions: [],
        enabled: true,
        usageCount: 3120,
        lastUsed: new Date(Date.now() - 10 * 60 * 1000), // 10分钟前
        settings: {
          maxFileSize: 2097152,
          allowedFileTypes: ['.txt', '.log'],
          maxConversationLength: 150,
          enableQualityControl: true,
          enableFeedback: true,
        },
      },
      {
        id: '5',
        type: 'legal',
        name: '法律审查助手',
        description: '合同审查、法律合规检查、案例检索和条款解释',
        icon: '⚖️',
        difyUrl: 'https://dify.example.com/legal',
        permissions: [],
        enabled: true,
        usageCount: 567,
        lastUsed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7天前
        settings: {
          maxFileSize: 10485760,
          allowedFileTypes: ['.pdf', '.doc', '.docx'],
          maxConversationLength: 100,
          enableQualityControl: true,
          enableFeedback: true,
        },
      },
    ];
    
    assistants.value = mockAssistants;
  } catch (err: any) {
    error.value = err.message || '加载AI助手配置失败';
    console.error('Failed to fetch assistants:', err);
  } finally {
    loading.value = false;
  }
};

// 导航到助手详情页
const navigateToAssistant = (type: AssistantType) => {
  router.push(`/ai-assistant/${type}`);
};

// 重试加载
const retry = () => {
  fetchAssistants();
};

// 组件挂载时加载数据
onMounted(() => {
  fetchAssistants();
});
</script>

<template>
  <div class="ai-assistant-hub">
    <!-- 页面标题 -->
    <div class="hub-header">
      <h1 class="hub-title">AI 助手中心</h1>
      <p class="hub-subtitle">选择适合您工作场景的AI助手,提升工作效率</p>
    </div>

    <!-- 搜索和过滤 -->
    <div class="hub-filters">
      <Input
        v-model:value="searchQuery"
        placeholder="搜索AI助手..."
        size="large"
        class="hub-search"
        allow-clear
      >
        <template #prefix>
          <Search :size="16" class="text-gray-400" />
        </template>
      </Input>

      <Select
        v-model:value="filterType"
        :options="assistantTypeOptions"
        size="large"
        class="hub-filter-select"
        placeholder="选择类型"
      />
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="hub-loading">
      <Spin size="large" tip="加载中..." />
    </div>

    <!-- 错误状态 -->
    <Alert
      v-else-if="error"
      type="error"
      :message="error"
      show-icon
      class="hub-error"
    >
      <template #description>
        <p>无法加载AI助手配置,请检查网络连接或稍后重试。</p>
        <a-button type="primary" @click="retry" class="mt-2">重试</a-button>
      </template>
    </Alert>

    <!-- 助手卡片网格 -->
    <div v-else-if="filteredAssistants.length > 0" class="hub-grid">
      <Row :gutter="[24, 24]">
        <Col
          v-for="assistant in filteredAssistants"
          :key="assistant.id"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
          :xl="6"
        >
          <AssistantCard
            :assistant="assistant"
            @click="navigateToAssistant(assistant.type)"
          />
        </Col>
      </Row>
    </div>

    <!-- 空状态 -->
    <Empty
      v-else
      description="没有找到匹配的AI助手"
      class="hub-empty"
    >
      <template #image>
        <span class="text-6xl">🤖</span>
      </template>
    </Empty>
  </div>
</template>

<style scoped>
.ai-assistant-hub {
  min-height: calc(100vh - 64px);
  padding: 24px;
  background: hsl(var(--background-deep));
}

.hub-header {
  margin-bottom: 32px;
  text-align: center;
}

.hub-title {
  margin: 0 0 8px;
  font-size: 32px;
  font-weight: 600;
  color: hsl(var(--foreground));
}

.hub-subtitle {
  margin: 0;
  font-size: 16px;
  color: hsl(var(--muted-foreground));
}

.hub-filters {
  display: flex;
  gap: 16px;
  max-width: 800px;
  margin-right: auto;
  margin-bottom: 32px;
  margin-left: auto;
}

.hub-search {
  flex: 1;
}

.hub-filter-select {
  width: 200px;
}

.hub-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.hub-error {
  max-width: 600px;
  margin: 0 auto;
}

.hub-grid {
  margin-bottom: 32px;
}

.hub-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 48px;
  background: hsl(var(--card));
  border-radius: 8px;
  border: 1px solid hsl(var(--border));
  color: hsl(var(--muted-foreground));
}

@media (max-width: 768px) {
  .ai-assistant-hub {
    padding: 16px;
  }

  .hub-title {
    font-size: 24px;
  }

  .hub-subtitle {
    font-size: 14px;
  }

  .hub-filters {
    flex-direction: column;
  }

  .hub-filter-select {
    width: 100%;
  }
}
</style>
