<script setup lang="ts">
import type { TabOption } from '@vben/types';

import { computed } from 'vue';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@vben-core/shadcn-ui';

interface Props {
  tabs?: TabOption[];
}

defineOptions({
  name: 'LoginTabs',
});

const props = withDefaults(defineProps<Props>(), {
  tabs: () => [],
});

const defaultValue = computed(() => {
  return props.tabs?.[0]?.value;
});
</script>

<template>
  <div class="mb-6 w-full">
    <Tabs class="login-tabs-wrapper" :default-value="defaultValue">
      <TabsList class="login-tabs-list-wrapper">
        <template v-for="tab in tabs" :key="tab.label">
          <TabsTrigger class="login-tabs-trigger-wrapper" :value="tab.value">
            {{ tab.label }}
          </TabsTrigger>
        </template>
      </TabsList>
      <template v-for="tab in tabs" :key="tab.label">
        <TabsContent :value="tab.value" class="login-tabs-content-wrapper pt-4">
          <slot :name="tab.value"></slot>
        </TabsContent>
      </template>
    </Tabs>
  </div>
</template>
<style scoped lang="scss"></style>
