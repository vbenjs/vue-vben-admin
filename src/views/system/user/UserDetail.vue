<template>
  <PageWrapper
    :title="`用户` + userId + `的资料`"
    content="这是用户资料详情页面。本页面仅用于演示相同路由在tab中打开多个页面并且显示不同的数据"
    contentBackground
    @back="goBack"
  >
    <template #extra>
      <a-button type="primary" danger> 禁用账号 </a-button>
      <a-button type="primary" @click="handlePassword"> 修改为默认密码 </a-button>
    </template>
    <template #footer>
      <Tabs default-active-key="detail" v-model:activeKey="currentKey">
        <Tabs.TabPane key="detail" tab="用户资料" />
        <Tabs.TabPane key="logs" tab="操作日志" />
      </Tabs>
    </template>
    <div class="pt-4 m-4 desc-wrap">
      <template v-if="currentKey == 'detail'">
        <div v-for="i in 10" :key="i">这是用户{{ userId }}资料Tab</div>
      </template>
      <template v-if="currentKey == 'logs'">
        <div v-for="i in 10" :key="i">这是用户{{ userId }}操作日志Tab</div>
      </template>
    </div>
  </PageWrapper>
</template>

<script lang="ts" setup name="用户详情">
  import { ref, onMounted } from 'vue';
  import { Tabs } from 'ant-design-vue';
  import { useRoute } from 'vue-router';
  import { PageWrapper } from '/@/components/Page';
  import { useGo } from '/@/hooks/web/usePage';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { getUserInfo, updateUserPassword } from '/@/api/system/user';

  const route = useRoute();
  const go = useGo();
  const userId = ref<number>(route.params?.id as unknown as number);
  const userInfo = ref({});
  const currentKey = ref('detail');
  const { setTitle } = useTabs();

  onMounted(async () => {
    console.log('mounted');
    userInfo.value = await getUserInfo(userId.value);
    console.log(userInfo.value);
  });

  async function handlePassword() {
    await updateUserPassword({ id: parseInt(userId.value), password: 'a123456' });
  }

  setTitle('详情：用户' + userId.value);

  function goBack() {
    go('/system/user');
  }
</script>

<style></style>
