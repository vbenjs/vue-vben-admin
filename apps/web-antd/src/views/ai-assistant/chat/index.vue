<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { Alert, Button, Card, Spin } from 'ant-design-vue';

const isLoading = ref(true);
const hasError = ref(false);

// Dify 聊天机器人配置
const DIFY_URL = 'https://dify.icerain.love/chatbot/wzr4NzKNvUuhiHhL';

/**
 * 页面初始化
 */
onMounted(() => {
  // 监听 iframe 加载事件
  setTimeout(() => {
    isLoading.value = false;
  }, 2000);
});

/**
 * iframe 加载完成回调
 */
const onIframeLoad = () => {
  isLoading.value = false;
  hasError.value = false;
};

/**
 * iframe 加载失败回调
 */
const onIframeError = () => {
  isLoading.value = false;
  hasError.value = true;
};
</script>

<template>
  <div class="ai-chat-page">
    <!-- 聊天内容区域 -->
    <div class="chat-content">
      <!-- 加载状态 -->
      <div v-if="isLoading" class="loading-container">
        <Card class="loading-card">
          <div class="loading-content">
            <Spin size="large" tip="正在加载AI助手..." />
            <p class="loading-tip">AI助手正在启动中，请稍候...</p>
          </div>
        </Card>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="hasError" class="error-container">
        <Card class="error-card">
          <Alert
            type="error"
            message="加载失败"
            description="无法加载AI助手，请检查网络连接或稍后重试。"
            show-icon
            class="error-alert"
          >
            <template #action>
              <Button type="primary" @click="location.reload()">
                重新加载
              </Button>
            </template>
          </Alert>
        </Card>
      </div>

      <!-- 聊天 iframe -->
      <div v-else class="iframe-container">
        <Card class="chat-card">
          <div class="iframe-wrapper">
            <iframe
              :src="DIFY_URL"
              class="chat-iframe"
              frameborder="0"
              allow="microphone"
              @load="onIframeLoad"
              @error="onIframeError"
              title="AI智能助手对话界面"
            ></iframe>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 响应式设计 */
@media (max-width: 768px) {
  .ai-chat-page {
    height: 100%;
    min-height: calc(100vh - 48px);
  }

  .chat-content {
    padding: 16px;
  }

  .footer-info {
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }

  .footer-text {
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .chat-content {
    padding: 8px;
  }
}

.ai-chat-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: calc(100vh - 100px);
  overflow: hidden;
  background: hsl(var(--background));
}

/* 聊天内容区域 */
.chat-content {
  box-sizing: border-box;
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 24px;
  overflow: hidden;
}

.loading-container,
.error-container,
.iframe-container {
  display: flex;
  flex: 1;
  align-items: stretch;
  justify-content: center;
  height: 100%;
}

.loading-card,
.error-card,
.chat-card {
  width: 100%;
  height: 100%;
}

.chat-card {
  display: flex;
  flex-direction: column;
}

.loading-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 400px;
}

.loading-tip {
  margin: 0;
  font-size: 14px;
  color: hsl(var(--muted-foreground));
}

.error-card {
  padding: 24px;
}

.error-alert {
  margin-bottom: 16px;
}

.chat-iframe {
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 8px;
}

.iframe-wrapper {
  position: relative;
  flex: 1;
  overflow: hidden;
  border-radius: 8px;
}

/* 叠加层用于遮挡 iframe 内的 Powered by 提示 */
.iframe-wrapper::after {
  position: absolute;
  right: 75px;
  bottom: 859px;
  z-index: 2;
  width: 120px;
  height: 32px;
  pointer-events: none;
  content: '';
  background: hsl(var(--card));
  background-color: #f8f9fa;
  border-radius: 6px;
}

/* 加载动画 */
.loading-content :deep(.ant-spin-text) {
  color: hsl(var(--primary));
}

/* 卡片样式优化 */
.chat-card :deep(.ant-card-body) {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0;
}

.loading-card :deep(.ant-card-body),
.error-card :deep(.ant-card-body) {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 24px;
}
</style>
