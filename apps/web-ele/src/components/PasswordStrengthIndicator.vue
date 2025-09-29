<script lang="ts" setup>
import { computed } from 'vue';

import { IconifyIcon } from '@vben/icons';

import { ElProgress } from 'element-plus';

interface Props {
  password?: string;
}

const props = withDefaults(defineProps<Props>(), {
  password: '',
});

// 密码强度检测规则
const passwordChecks = computed(() => {
  const { password } = props;

  return {
    length: {
      name: '长度6-20位',
      passed: password.length >= 6 && password.length <= 20,
    },
    uppercase: {
      name: '包含大写字母',
      passed: /[A-Z]/.test(password),
    },
    lowercase: {
      name: '包含小写字母',
      passed: /[a-z]/.test(password),
    },
    number: {
      name: '包含数字',
      passed: /\d/.test(password),
    },
    symbol: {
      name: '包含标点符号',
      passed: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  };
});

// 计算密码强度
const passwordStrength = computed(() => {
  const checks = passwordChecks.value;
  const passedCount = Object.values(checks).filter(
    (check) => check.passed,
  ).length;

  if (passedCount === 0) return { level: 0, text: '无', color: '#d9d9d9' };
  if (passedCount <= 2) return { level: 1, text: '弱', color: '#ff4d4f' };
  if (passedCount <= 4) return { level: 2, text: '中', color: '#faad14' };
  return { level: 3, text: '强', color: '#52c41a' };
});

// 计算强度百分比
const strengthPercentage = computed(() => {
  return (passwordStrength.value.level / 3) * 100;
});
</script>

<template>
  <div class="password-strength-indicator animate-fade-in">
    <!-- 密码强度进度条 -->
    <div class="mb-2">
      <div class="mb-1 flex items-center justify-between">
        <span class="text-muted-foreground text-sm">密码强度</span>
        <span
          class="text-sm font-medium transition-colors duration-300 ease-out"
          :style="{ color: passwordStrength.color }"
        >
          {{ passwordStrength.text }}
        </span>
      </div>
      <ElProgress
        :percentage="strengthPercentage"
        :color="passwordStrength.color"
        :show-text="false"
        :stroke-width="6"
        class="transition-all duration-300 ease-out"
      />
    </div>

    <!-- 密码要求检查列表 -->
    <div class="space-y-1">
      <div
        v-for="(check, key) in passwordChecks"
        :key="key"
        class="flex items-center text-xs"
      >
        <IconifyIcon
          :icon="check.passed ? 'lucide:check-circle' : 'lucide:circle'"
          class="mr-2 h-3 w-3 transition-colors duration-200 ease-out"
          :class="[check.passed ? 'text-success' : 'text-muted-foreground']"
        />
        <span
          class="transition-colors duration-200 ease-out"
          :class="[check.passed ? 'text-success' : 'text-muted-foreground']"
        >
          {{ check.name }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in-scale {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-8px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.password-strength-indicator {
  padding: 12px;
  background-color: hsl(var(--muted));
  border: 1px solid hsl(var(--border));
  border-radius: 6px;
  transition: all 0.3s ease-out;
}

.animate-fade-in {
  animation: fade-in-scale 0.3s ease-out;
}

/* 进度条平滑过渡 */
.password-strength-indicator :deep(.el-progress-bar__outer) {
  transition: all 0.3s ease-out;
}

.password-strength-indicator :deep(.el-progress-bar__inner) {
  transition: all 0.3s ease-out !important;
}
</style>
