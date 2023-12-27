<template>
  <PageWrapper title="带参数标签页" content="支持带参数多tab缓存">
    Current Param : {{ computedParams }}
    <br />
    Keep Alive
    <Input />
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { computed, unref } from 'vue';
  import { useRouter } from 'vue-router';

  import { Input } from 'ant-design-vue';
  import { PageWrapper } from '@/components/Page';

  const { currentRoute } = useRouter();

  defineOptions({
    name: 'TestTab',
  });

  const computedParams = computed(() => unref(currentRoute).params);
</script>
