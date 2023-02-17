<template>
  <div></div>
</template>
<script lang="ts" setup>
  import { useRoute } from 'vue-router';
  import { useUserStore } from '/@/store/modules/user';
  import { authorize } from '/@/apis/security';

  const code = useRoute().query.code as string;
  if (code) {
    const userStore = useUserStore();
    userStore.login(code, true);
  } else {
    authorize();
  }
</script>
