<script lang="ts" setup>
/**
 * CommandPalette - 全局命令面板 (类似 VS Code Ctrl+K / Raycast)
 * 通过快捷键 Ctrl+K (或 Cmd+K) 唤起，提供全局路由搜索与快速跳转
 */
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { $t } from '@vben/locales';

import { Input, Modal } from 'ant-design-vue';

defineOptions({ name: 'CommandPalette' });

const router = useRouter();
const visible = ref(false);
const searchQuery = ref('');
const selectedIndex = ref(0);
const inputRef = ref<{ focus: () => void } | null>(null);

/**
 * 从路由元信息中构建可搜索的命令列表
 * 只取有 title 的叶子路由（即实际页面）
 */
const allCommands = computed(() => {
  const routes = router.getRoutes();
  return routes
    .filter((route) => {
      // 只要有 title 且不是 layout 容器路由
      return route.meta?.title && !route.redirect && route.components;
    })
    .map((route) => ({
      path: route.path,
      title: $t(route.meta.title as string),
      name: route.name as string,
    }))
    .toSorted((a, b) => a.title.localeCompare(b.title));
});

/** 根据搜索关键字过滤命令列表 */
const filteredCommands = computed(() => {
  if (!searchQuery.value.trim()) {
    return allCommands.value.slice(0, 15);
  }
  const query = searchQuery.value.toLowerCase();
  return allCommands.value
    .filter(
      (cmd) =>
        cmd.title.toLowerCase().includes(query) ||
        cmd.path.toLowerCase().includes(query),
    )
    .slice(0, 15);
});

/** 监听搜索内容变化时重置选中索引 */
watch(searchQuery, () => {
  selectedIndex.value = 0;
});

/** 跳转到选中的路由 */
function navigateTo(path: string) {
  visible.value = false;
  searchQuery.value = '';
  router.push(path);
}

/** 处理键盘导航 */
function handleKeydown(e: KeyboardEvent) {
  const len = filteredCommands.value.length;
  if (!len) return;

  switch (e.key) {
    case 'ArrowDown': {
      e.preventDefault();
      selectedIndex.value = (selectedIndex.value + 1) % len;

      break;
    }
    case 'ArrowUp': {
      e.preventDefault();
      selectedIndex.value = (selectedIndex.value - 1 + len) % len;

      break;
    }
    case 'Enter': {
      e.preventDefault();
      const selected = filteredCommands.value[selectedIndex.value];
      if (selected) {
        navigateTo(selected.path);
      }

      break;
    }
    // No default
  }
}

/** 全局快捷键 Ctrl+K / Cmd+K 打开命令面板 */
function handleGlobalKeydown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    visible.value = !visible.value;
    if (visible.value) {
      nextTick(() => {
        inputRef.value?.focus();
      });
    }
  }
  // Escape 关闭
  if (e.key === 'Escape' && visible.value) {
    visible.value = false;
    searchQuery.value = '';
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleGlobalKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleGlobalKeydown);
});

function onAfterOpen(isVisible: boolean) {
  if (isVisible) {
    nextTick(() => {
      inputRef.value?.focus();
    });
  }
}
</script>

<template>
  <Modal
    v-model:open="visible"
    :closable="false"
    :footer="null"
    :mask-closable="true"
    :width="560"
    class="command-palette-modal"
    @after-open-change="onAfterOpen"
  >
    <div class="command-palette" @keydown="handleKeydown">
      <!-- 搜索输入框 -->
      <div class="command-palette__search">
        <Input
          ref="inputRef"
          v-model:value="searchQuery"
          placeholder="搜索页面或功能... (Ctrl+K)"
          allow-clear
          size="large"
        >
          <template #prefix>
            <span class="command-palette__search-icon">🔍</span>
          </template>
        </Input>
      </div>

      <!-- 搜索结果列表 -->
      <div class="command-palette__results">
        <div
          v-if="filteredCommands.length === 0"
          class="command-palette__empty"
        >
          没有找到匹配的页面
        </div>
        <div
          v-for="(cmd, index) in filteredCommands"
          :key="cmd.path"
          class="command-palette__item"
          :class="[
            { 'command-palette__item--active': index === selectedIndex },
          ]"
          @click="navigateTo(cmd.path)"
          @mouseenter="selectedIndex = index"
        >
          <span class="command-palette__item-icon">📄</span>
          <div class="command-palette__item-content">
            <span class="command-palette__item-title">{{ cmd.title }}</span>
            <span class="command-palette__item-path">{{ cmd.path }}</span>
          </div>
          <span
            v-if="index === selectedIndex"
            class="command-palette__item-hint"
          >
            ↵
          </span>
        </div>
      </div>

      <!-- 底部快捷键提示 -->
      <div class="command-palette__footer">
        <span><kbd>↑↓</kbd> 导航</span>
        <span><kbd>↵</kbd> 打开</span>
        <span><kbd>Esc</kbd> 关闭</span>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
/* === 玻璃态命令面板样式 (Glassmorphism) === */
.command-palette {
  margin: -24px;
  overflow: hidden;
  border-radius: 12px;
}

/* 搜索区域 - 渐变底边 */
.command-palette__search {
  padding: 16px 20px;
  border-bottom: 1px solid
    color-mix(in srgb, var(--ant-color-border) 60%, transparent);
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--ant-color-primary) 4%, transparent),
    transparent
  );
}

.command-palette__search-icon {
  font-size: 18px;
  filter: grayscale(0.3);
  transition: filter 0.2s ease;
}

.command-palette__search:focus-within .command-palette__search-icon {
  filter: grayscale(0);
}

/* 搜索结果列表 - 滚动条美化 */
.command-palette__results {
  max-height: 380px;
  padding: 8px 4px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--ant-color-fill-secondary) transparent;
}

.command-palette__results::-webkit-scrollbar {
  width: 4px;
}

.command-palette__results::-webkit-scrollbar-thumb {
  background: var(--ant-color-fill-secondary);
  border-radius: 4px;
}

/* 空状态 */
.command-palette__empty {
  padding: 32px;
  color: var(--ant-color-text-tertiary);
  text-align: center;
  font-size: 14px;
}

/* 列表项 - 玻璃态高亮 + 微动效 */
.command-palette__item {
  display: flex;
  gap: 14px;
  align-items: center;
  padding: 12px 16px;
  margin: 2px 8px;
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
}

.command-palette__item:hover,
.command-palette__item--active {
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--ant-color-primary) 8%, transparent),
    color-mix(in srgb, var(--ant-color-primary) 3%, transparent)
  );
  border-color: color-mix(in srgb, var(--ant-color-primary) 15%, transparent);
  box-shadow: 0 2px 8px
    color-mix(in srgb, var(--ant-color-primary) 8%, transparent);
  transform: translateX(4px);
}

/* 图标 - 动态缩放 */
.command-palette__item-icon {
  font-size: 18px;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.command-palette__item--active .command-palette__item-icon,
.command-palette__item:hover .command-palette__item-icon {
  transform: scale(1.15);
}

/* 内容区 */
.command-palette__item-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.command-palette__item-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--ant-color-text);
  transition: color 0.15s ease;
}

.command-palette__item--active .command-palette__item-title {
  color: var(--ant-color-primary);
}

.command-palette__item-path {
  font-size: 12px;
  color: var(--ant-color-text-quaternary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.15s ease;
}

.command-palette__item--active .command-palette__item-path {
  color: var(--ant-color-text-tertiary);
}

/* 回车提示动画 */
.command-palette__item-hint {
  font-size: 16px;
  color: var(--ant-color-primary);
  flex-shrink: 0;
  opacity: 0;
  transform: translateX(-8px);
  transition: all 0.2s ease;
}

.command-palette__item--active .command-palette__item-hint {
  opacity: 1;
  transform: translateX(0);
}

/* 底部快捷键栏 - 磨砂质感 */
.command-palette__footer {
  display: flex;
  gap: 20px;
  justify-content: center;
  padding: 10px 16px;
  border-top: 1px solid
    color-mix(in srgb, var(--ant-color-border) 60%, transparent);
  font-size: 12px;
  color: var(--ant-color-text-tertiary);
  background: color-mix(
    in srgb,
    var(--ant-color-fill-quaternary) 50%,
    transparent
  );
}

.command-palette__footer kbd {
  display: inline-block;
  padding: 1px 6px;
  font-size: 11px;
  font-family: inherit;
  background: var(--ant-color-fill-tertiary);
  border: 1px solid var(--ant-color-border);
  border-radius: 5px;
  margin: 0 3px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  transition: all 0.15s ease;
}

.command-palette__footer kbd:hover {
  background: var(--ant-color-fill-secondary);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>

<!-- 全局样式：覆盖 Ant Design Modal 容器的默认样式 -->
<style>
.command-palette-modal .ant-modal-content {
  border-radius: 16px !important;
  overflow: hidden;
  backdrop-filter: blur(20px) saturate(1.8);
  background: color-mix(
    in srgb,
    var(--ant-color-bg-elevated) 85%,
    transparent
  ) !important;
  border: 1px solid color-mix(in srgb, var(--ant-color-border) 40%, transparent);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.12),
    0 2px 8px rgba(0, 0, 0, 0.08) !important;
}

.command-palette-modal .ant-modal-mask {
  backdrop-filter: blur(4px);
}
</style>
