<script setup lang="ts">
import { h, onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { ArrowLeft, Maximize, Minimize } from '@vben/icons';

import { Alert, Button, Card, Spin } from 'ant-design-vue';

const router = useRouter();
const isLoading = ref(true);
const hasError = ref(false);
const isFullscreen = ref(false);
const chatContainer = ref<HTMLElement>();

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
 * 页面卸载时的清理工作
 */
onUnmounted(() => {
  // 清理事件监听器等
});

/**
 * 返回助手中心
 */
const goBack = () => {
  router.push('/ai-assistant');
};

/**
 * 切换全屏模式
 */
const toggleFullscreen = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
    isFullscreen.value = false;
  } else {
    chatContainer.value?.requestFullscreen();
    isFullscreen.value = true;
  }
};

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

/**
 * 监听全屏状态变化
 */
const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement;
};

// 添加全屏状态监听
onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange);
});

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
});
</script>

<template>
  <div class="ai-chat-page" ref="chatContainer">
    <!-- 页面头部 -->
    <div class="chat-header">
      <div class="header-left">
        <Button
          type="text"
          :icon="h(ArrowLeft)"
          @click="goBack"
          class="back-button"
        >
          返回助手中心
        </Button>
      </div>
      <div class="header-right">
        <Button
          type="text"
          :icon="isFullscreen ? h(Minimize) : h(Maximize)"
          @click="toggleFullscreen"
          class="fullscreen-button"
          :title="isFullscreen ? '退出全屏' : '全屏模式'"
        >
          {{ isFullscreen ? '退出全屏' : '全屏' }}
        </Button>
      </div>
    </div>

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
          <iframe
            :src="DIFY_URL"
            class="chat-iframe"
            frameborder="0"
            allow="microphone"
            @load="onIframeLoad"
            @error="onIframeError"
            title="AI智能助手对话界面"
          ></iframe>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 响应式设计 */
@media (max-width: 768px) {
  .ai-chat-page {
    height: calc(100vh - 48px);
  }

  .chat-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
    padding: 12px 16px;
  }

  .header-left {
    justify-content: space-between;
    width: 100%;
  }

  .header-right {
    justify-content: flex-end;
    width: 100%;
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
  .back-button span {
    display: none;
  }

  .fullscreen-button span {
    display: none;
  }

  .chat-content {
    padding: 8px;
  }
}

.ai-chat-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
  overflow: hidden;
  background: hsl(var(--background));
}

/* 页面头部 */
.chat-header {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: hsl(var(--card));
  border-bottom: 1px solid hsl(var(--border));
}

.header-left {
  display: flex;
  gap: 16px;
  align-items: center;
}

.back-button {
  display: flex;
  gap: 8px;
  align-items: center;
  color: hsl(var(--muted-foreground));
  transition: color 0.2s ease;
}

.back-button:hover {
  color: hsl(var(--primary));
}

.header-title h1 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: hsl(var(--foreground));
}

.header-title p {
  margin: 4px 0 0;
  font-size: 14px;
  color: hsl(var(--muted-foreground));
}

.header-right {
  display: flex;
  gap: 8px;
  align-items: center;
}

.fullscreen-button {
  display: flex;
  gap: 6px;
  align-items: center;
  color: hsl(var(--muted-foreground));
  transition: color 0.2s ease;
}

.fullscreen-button:hover {
  color: hsl(var(--primary));
}

/* 聊天内容区域 */
.chat-content {
  flex: 1;
  padding: 24px;
  overflow: hidden;
}

.loading-container,
.error-container,
.iframe-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.loading-card,
.error-card,
.chat-card {
  width: 100%;
  max-width: 1200px;
  height: 100%;
  max-height: 800px;
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
  min-height: 700px;
  border: none;
  border-radius: 8px;
}

/* 全屏模式样式 */
.ai-chat-page:fullscreen {
  background: hsl(var(--background));
}

.ai-chat-page:fullscreen .chat-header {
  background: hsl(var(--background));
  backdrop-filter: blur(8px);
}

.ai-chat-page:fullscreen .chat-footer {
  background: hsl(var(--background));
  backdrop-filter: blur(8px);
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
