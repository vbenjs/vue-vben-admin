<template>
  <PageWrapper
    title="登录过期示例"
    content="用户登录过期示例，不再跳转登录页，直接生成页面覆盖当前页面，方便保持过期前的用户状态！"
  >
    <a-button type="primary" @click="test">点击触发用户登录过期</a-button>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { PageWrapper } from '/@/components/Page';

  import { sessionTimeoutApi } from '/@/api/demo/account';

  export default defineComponent({
    name: 'TestSessionTimeout',
    components: { PageWrapper },
    setup() {
      async function test() {
        await sessionTimeoutApi();
      }
      return { test };
    },
  });
</script>
