<script setup lang="ts">
import { type Component, computed } from 'vue';

import { Icon, IconDefault } from '@vben-core/icons';
import { isFunction, isHttpUrl, isObject, isString } from '@vben-core/shared';

const props = defineProps<{
  // 没有是否显示默认图标
  fallback?: boolean;
  icon?: Component | Function | string;
}>();

const isRemoteIcon = computed(() => {
  return isString(props.icon) && isHttpUrl(props.icon);
});

const isComponent = computed(() => {
  const { icon } = props;
  return !isString(icon) && (isObject(icon) || isFunction(icon));
});
</script>

<template>
  <component :is="icon as Component" v-if="isComponent" v-bind="$attrs" />
  <img v-else-if="isRemoteIcon" :src="icon as string" v-bind="$attrs" />
  <Icon v-else-if="icon" v-bind="$attrs" :icon="icon as string" />
  <IconDefault v-else-if="fallback" v-bind="$attrs" />
</template>
