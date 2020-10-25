<template>
  <div class="p-4 lazy-base-demo">
    <Alert message="基础示例" description="向下滚动到可见区域才会加载组件" type="info" show-icon />
    <div class="lazy-base-demo-wrap">
      <h1>向下滚动</h1>
      <LazyContainer @init="() => {}">
        <TargetContent />
        <template #skeleton>
          <Skeleton :rows="10" />
        </template>
      </LazyContainer>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { Skeleton, Alert } from 'ant-design-vue';
  import TargetContent from './TargetContent.vue';
  import { LazyContainer } from '/@/components/Container/index';
  export default defineComponent({
    components: { LazyContainer, TargetContent, Skeleton, Alert },
    setup() {
      return {};
    },
  });
</script>
<style lang="less" scoped>
  .lazy-base-demo {
    &-wrap {
      display: flex;
      width: 50%;
      height: 2000px;
      margin: 20px auto;
      text-align: center;
      background: #fff;
      justify-content: center;
      flex-direction: column;
      align-items: center;
    }

    h1 {
      height: 1300px;
      margin: 20px 0;
    }
  }
</style>
