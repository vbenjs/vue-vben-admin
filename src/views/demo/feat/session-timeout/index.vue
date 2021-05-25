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
  import { useUserStore } from '/@/store/modules/user';

  import { sessionTimeoutApi } from '/@/api/demo/account';

  export default defineComponent({
    name: 'TestSessionTimeout',
    components: { PageWrapper },
    setup() {
      const userStore = useUserStore();
      async function test() {
        // 示例网站生产环境用得是mock数据，所以不能返回401，
        // 所以在生产环境直接改变状态来达到测试效果
        if (import.meta.env.PROD) {
          userStore.setToken(undefined);
          userStore.setSessionTimeout(true);
        } else {
          await sessionTimeoutApi();
        }
      }
      return { test };
    },
  });
</script>
