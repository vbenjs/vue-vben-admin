<template>
  <div></div>
</template>
<script lang="ts" setup>
  import { isArray } from '@vben/shared';
  import { useRoute, useRouter } from 'vue-router';

  const { replace } = useRouter();
  const { params, query } = useRoute();

  const { path } = params;

  Reflect.deleteProperty(params, 'path');

  replace({
    path: isArray(path) ? path.join('/') : path,
    query,
  });
</script>
