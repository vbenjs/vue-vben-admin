<script setup lang="ts">
import type { TabItem } from '@vben-core/typings';

import { useForwardPropsEmits } from '@vben-core/shadcn-ui';

import { ChromeTabs } from './components';
import { TabsProps } from './types';

interface Props extends TabsProps {}

defineOptions({
  name: 'TabsView',
});

const props = withDefaults(defineProps<Props>(), {});

const emit = defineEmits<{ close: [string]; unPushPin: [TabItem] }>();

const forward = useForwardPropsEmits(props, emit);
</script>

<template>
  <ChromeTabs v-bind="forward" />
</template>
