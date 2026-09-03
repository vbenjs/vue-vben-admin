<script setup lang="ts">
import { useVbenModal } from '../../use-modal';

interface TypedModalData {
  id: number;
  mode: 'edit' | 'view';
}

const [, modalApi] = useVbenModal<TypedModalData | null>();

defineExpose({ modalApi });
</script>

<template>
  <div />
</template>
