<template>
  <transition name="fade-bottom">
    <LockPage v-if="getIsLock" />
  </transition>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import LockPage from '/@/views/sys/lock/index.vue';
  import { getIsLock } from '/@/hooks/web/useLockPage';
  export default defineComponent({
    name: 'LayoutLockPage',
    components: { LockPage },
    setup() {
      return { getIsLock };
    },
  });
</script>
