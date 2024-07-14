<script lang="ts" setup>
import type { DropdownMenuProps } from '@vben-core/shadcn-ui';

import { IcRoundKeyboardArrowDown } from '@vben-core/iconify';
import { VbenDropdownMenu } from '@vben-core/shadcn-ui';

defineProps<DropdownMenuProps>();
</script>

<template>
  <VbenDropdownMenu :menus="menus" :modal="false">
    <div
      class="flex-center hover:bg-muted bg-accent hover:text-foreground text-muted-foreground border-border h-full cursor-pointer border-l px-1.5 text-lg font-semibold"
    >
      <IcRoundKeyboardArrowDown class="size-5" />
    </div>
  </VbenDropdownMenu>
</template>
