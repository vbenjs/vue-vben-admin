<script lang="ts" setup>
import type { CSSProperties } from 'vue';

import { VbenSpinner } from '@vben-core/shadcn-ui';

import { useContentSpinner } from './use-content-spinner';

defineOptions({ name: 'LayoutContentSpinner' });

defineProps<{ overlayStyle: CSSProperties }>();

const { spinning } = useContentSpinner();
</script>
<template>
  <VbenSpinner :spinning="spinning" :style="overlayStyle" />
</template>
