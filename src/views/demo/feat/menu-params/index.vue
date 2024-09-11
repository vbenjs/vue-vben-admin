<template>
  <PageWrapper title="带参数菜单（路由）" content="支持多级参数">
    当前参数：{{ computedParams }}
    <br />
    输入参数切换路由：
    <a-input v-model:value="value" placeholder="建议为url标准字符，输入后点击切换" />
    <a-button type="primary" class="my-2" @click="handleClickGo">切换路由</a-button>
    <br />
    切换路由后
    <ul>
      <li>可刷新页面测试路由参数情况是否正常。</li>
      <li>可于左侧菜单中展开子菜单，点击测试参数是否携带正常。</li>
    </ul>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { useRouter } from 'vue-router';
  import { computed, ref, unref } from 'vue';
  import { PageWrapper } from '@/components/Page';

  const value = ref('');

  const { currentRoute, replace } = useRouter();

  const computedParams = computed(() => unref(currentRoute).params);

  const handleClickGo = () => {
    const { name } = unref(currentRoute);
    replace({ name: name!, params: { id: unref(value) } });
  };
</script>
