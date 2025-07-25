<script lang="ts" setup>
import { Support } from '#/icons';
import { useShopSettingStore } from '#/store';

const shopSettingStore = useShopSettingStore();
</script>
<template>
  <div
    class="md:bg-accent group flex h-8 cursor-pointer items-center gap-2 rounded-2xl border-none bg-none px-2 py-0.5 outline-none"
    @click="shopSettingStore.toggleChatPopup()"
  >
    <Support class="size-5" />
    <span
      class="text-muted-foreground group-hover:text-foreground hidden text-xs duration-300 md:block"
    >
      Chat with Support
    </span>
  </div>
</template>

<style scoped></style>
