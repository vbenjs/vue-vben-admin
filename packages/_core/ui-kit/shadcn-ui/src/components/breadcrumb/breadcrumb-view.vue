<script lang="ts" setup>
import type { BreadcrumbProps } from './types';

import { useForwardPropsEmits } from 'radix-vue';

import Breadcrumb from './breadcrumb.vue';
import BreadcrumbBackground from './breadcrumb-background.vue';

interface Props extends BreadcrumbProps {
  class?: any;
}

const props = withDefaults(defineProps<Props>(), {});

const emit = defineEmits<{ select: [string] }>();

const forward = useForwardPropsEmits(props, emit);
</script>
<template>
  <Breadcrumb v-if="styleType === 'normal'" v-bind="forward" />
  <BreadcrumbBackground v-if="styleType === 'background'" v-bind="forward" />
</template>
