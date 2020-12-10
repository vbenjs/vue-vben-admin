<template>
  <transition name="fade-bottom" mode="out-in">
    <LockPage v-if="getIsLock" />
  </transition>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import LockPage from './LockPage.vue';
  import { getIsLock } from '/@/hooks/web/useLockPage';
  export default defineComponent({
    name: 'Lock',
    components: { LockPage },
    setup() {
      return { getIsLock };
    },
  });
</script>
