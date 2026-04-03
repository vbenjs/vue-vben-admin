<script lang="ts" setup>
/**
 * AsyncPage - 异步页面/组件加载包装器
 * 提供统一的 Skeleton 骨架屏过渡效果，用于 <Suspense> 场景
 *
 * 使用方式:
 * <AsyncPage>
 *   <MyHeavyComponent />
 * </AsyncPage>
 */
import { Skeleton } from 'ant-design-vue';

interface Props {
  /** 是否启用动画效果 */
  active?: boolean;
  /** 骨架屏行数 */
  rows?: number;
}

withDefaults(defineProps<Props>(), {
  active: true,
  rows: 4,
});
</script>

<template>
  <Suspense>
    <template #default>
      <slot></slot>
    </template>
    <template #fallback>
      <div class="p-4">
        <Skeleton :active="active" :paragraph="{ rows }" />
      </div>
    </template>
  </Suspense>
</template>
