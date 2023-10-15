<template>
  <PageWrapper title="引导页" content="用于给用户的指引操作">
    <a-button type="primary" @click="handleStart">开始</a-button>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { driver } from 'driver.js';
  import 'driver.js/dist/driver.css';

  export default defineComponent({
    components: { PageWrapper },
    setup() {
      const { prefixVar } = useDesign('');

      function handleStart() {
        driver({
          showProgress: true,
          steps: [
            {
              popover: {
                title: 'Welcome',
                description: 'Hello World! 👋',
              },
            },
            {
              element: `.${prefixVar}-layout-header-trigger`,
              popover: {
                title: 'Collapse Button',
                description: 'This is the menu collapse button.',
              },
            },
            {
              element: `.${prefixVar}-layout-header-action`,
              popover: {
                title: 'User Action',
                description: 'This is the user function area.',
              },
            },
          ],
        }).drive();
      }
      return { handleStart };
    },
  });
</script>
