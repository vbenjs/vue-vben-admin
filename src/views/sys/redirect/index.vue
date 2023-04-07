<template>
  <div></div>
</template>
<script lang="ts" setup>
  import { unref } from 'vue';
  import { useRouter } from 'vue-router';
  import { isArray } from '@vben/shared';

  const { currentRoute, replace } = useRouter();

  const { params, query } = unref(currentRoute);
  const { path, _redirect_type = 'path' } = params;

  Reflect.deleteProperty(params, '_redirect_type');
  Reflect.deleteProperty(params, 'path');

  const _path = isArray(path) ? path.join('/') : path;

  if (_redirect_type === 'name') {
    replace({
      name: _path,
      query,
      params,
    });
  } else {
    replace({
      path: _path.startsWith('/') ? _path : '/' + _path,
      query,
    });
  }
</script>
