<script setup lang="ts">
import { ref } from 'vue';
import { Card, Button } from 'ant-design-vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const message = ref('AI助手测试页面');

const goToChat = () => {
  router.push('/ai-assistant/chat');
};

const goToHub = () => {
  router.push('/ai-assistant');
};
</script>

<template>
  <div class="test-page">
    <Card title="AI助手模块测试" class="test-card">
      <div class="test-content">
        <h2>{{ message }}</h2>
        <p>这是一个简单的测试页面，用于验证路由和组件是否正常工作。</p>

        <div class="test-buttons">
          <Button type="primary" @click="goToChat" style="margin-right: 16px">
            前往聊天页面
          </Button>
          <Button @click="goToHub">
            前往助手中心
          </Button>
        </div>
      </div>
    </Card>
  </div>
</template>

<style scoped>
.test-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
  background: hsl(var(--background));
}

.test-card {
  width: 100%;
  max-width: 600px;
}

.test-content {
  padding: 24px;
  text-align: center;
}

.test-content h2 {
  margin-bottom: 16px;
  color: hsl(var(--foreground));
}

.test-content p {
  margin-bottom: 32px;
  color: hsl(var(--muted-foreground));
}

.test-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
}
</style>