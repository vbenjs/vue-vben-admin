<script lang="ts" setup>
import { ref } from 'vue';

import { RotateCw } from '@vben-core/icons';

const emit = defineEmits<{ refresh: [] }>();

const loading = ref(false);
function handleClick() {
  loading.value = true;

  setTimeout(() => {
    loading.value = false;
  }, 1000);
  emit('refresh');
}
</script>

<template>
  <div
    class="flex-center hover:bg-muted hover:text-foreground text-muted-foreground border-border h-full cursor-pointer border-l px-[9px] text-lg font-semibold"
    @click="handleClick"
  >
    <RotateCw
      :class="{
        'animate-spin duration-1000': loading,
      }"
      class="size-4"
    />
  </div>
</template>
