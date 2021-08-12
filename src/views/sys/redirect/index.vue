<template>
  <div></div>
</template>
<script lang="ts" setup>
  import { unref } from 'vue';
  import { useRouter } from 'vue-router';

  const { currentRoute, replace } = useRouter();

  const { params, query } = unref(currentRoute);
  const { path } = params;

  const _path = Array.isArray(path) ? path.join('/') : path;

  replace({
    path: '/' + _path,
    query,
  });
</script>
