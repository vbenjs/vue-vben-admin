<template>
  <PageWrapper title="引导页" content="用于给用户的指引操作">
    <a-button type="primary" @click="handleOpen(true)">开始</a-button>
    <Tour v-model:current="current" :open="open" :steps="steps" @close="handleOpen(false)" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { PageWrapper } from '@/components/Page';
  import { useDesign } from '@/hooks/web/useDesign';
  import { ref } from 'vue';
  import { Tour, TourProps } from 'ant-design-vue';

  const open = ref<boolean>(false);
  const { prefixVar } = useDesign('');

  const current = ref(0);
  const steps: TourProps['steps'] = [
    {
      title: 'Welcome',
      description: 'Hello World! 👋',
    },
    {
      title: 'Collapse Button',
      description: 'This is the menu collapse button.',
      target: () => document.querySelector(`.${prefixVar}-layout-header-trigger`) as HTMLElement,
    },
    {
      title: 'User Action',
      description: 'This is the user function area.',
      target: () => document.querySelector(`.${prefixVar}-layout-header-action`) as HTMLElement,
    },
  ];

  const handleOpen = (val: boolean): void => {
    current.value = 0;
    open.value = val;
  };
</script>
