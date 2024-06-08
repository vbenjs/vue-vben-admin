<script lang="ts" setup>
import type { DropdownMenuProps } from '@vben-core/shadcn-ui';

import { IcRoundMoreVert } from '@vben-core/iconify';
import { VbenDropdownMenu } from '@vben-core/shadcn-ui';

defineProps<DropdownMenuProps>();
</script>

<template>
  <VbenDropdownMenu :menus="menus">
    <div
      class="flex-center hover:bg-accent hover:text-foreground text-muted-foreground h-full cursor-pointer border-l px-2 text-lg font-semibold"
    >
      <IcRoundMoreVert />
    </div>
  </VbenDropdownMenu>
</template>
