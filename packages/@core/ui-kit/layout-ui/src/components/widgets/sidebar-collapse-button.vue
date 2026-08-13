<script setup lang="ts">
import { useSimpleLocale } from '@vben-core/composables';
import { ChevronsLeft, ChevronsRight } from '@vben-core/icons';

const collapsed = defineModel<boolean>('collapsed');
const { $t } = useSimpleLocale();

function handleCollapsed() {
  collapsed.value = !collapsed.value;
}
</script>

<template>
  <button
    type="button"
    :aria-label="$t('toggleSidebar')"
    :aria-pressed="collapsed"
    data-layout-action="toggle-sidebar-collapse"
    class="absolute bottom-2 left-3 z-10 flex-center cursor-pointer rounded-sm bg-accent p-1 text-foreground/60 hover:bg-accent-hover hover:text-foreground"
    @click.stop="handleCollapsed"
  >
    <ChevronsRight v-if="collapsed" class="size-4" />
    <ChevronsLeft v-else class="size-4" />
  </button>
</template>
