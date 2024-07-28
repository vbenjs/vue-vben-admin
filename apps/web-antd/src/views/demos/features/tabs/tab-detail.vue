<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import { useTabs } from '@vben/hooks';

const route = useRoute();

const { setTabTitle } = useTabs();

const index = computed(() => {
  return route.params?.id ?? -1;
});

setTabTitle(`No.${index.value} - 详情信息`);
</script>

<template>
  <div class="p-5">
    <div class="card-box p-5">
      <h1 class="text-xl font-semibold">标签详情页</h1>
      <div class="text-foreground/80 mt-2">
        <div>{{ index }} - 详情页内容在此</div>
      </div>
    </div>
  </div>
</template>
