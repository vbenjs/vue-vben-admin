<template>
  <SiderTrigger v-if="sider" />
  <HeaderTrigger v-else :theme="theme" />
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
  import { propTypes } from '/@/utils/propTypes';

  export default defineComponent({
    name: 'LayoutTrigger',
    components: {
      SiderTrigger: createAsyncComponent(() => import('./SiderTrigger.vue')),
      HeaderTrigger: createAsyncComponent(() => import('./HeaderTrigger.vue'), { loading: true }),
    },
    props: {
      sider: propTypes.bool.def(true),
      theme: propTypes.oneOf(['light', 'dark']),
    },
  });
</script>
