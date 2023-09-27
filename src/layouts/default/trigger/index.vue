<template>
  <SiderTrigger v-if="sider" />
  <HeaderTrigger v-else :theme="theme" />
</template>
<script lang="ts"></script>
<script lang="ts" setup>
  import { propTypes } from '/@/utils/propTypes';
  import HeaderTrigger from './HeaderTrigger.vue';
  import SiderTrigger from './SiderTrigger.vue';

  defineProps({
    sider: propTypes.bool.def(true),
    theme: propTypes.oneOf(['light', 'dark']),
  });
</script>
