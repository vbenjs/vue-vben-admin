<script setup lang="ts">
import { useVbenDrawer } from '../../use-drawer';

interface TypedDrawerData {
  id: number;
  mode: 'edit' | 'view';
}

const [, drawerApi] = useVbenDrawer<TypedDrawerData | null>();

defineExpose({ drawerApi });
</script>

<template>
  <div />
</template>
