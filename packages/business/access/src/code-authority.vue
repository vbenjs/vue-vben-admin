<!--
 Access control component for fine-grained access control.
-->
<script lang="ts" setup>
import { useAccess } from './use-access';

interface Props {
  /**
   * Specified codes is visible
   * @default []
   */
  codes?: string[];
}

defineOptions({
  name: 'CodeAuthority',
});

withDefaults(defineProps<Props>(), {
  codes: () => [],
});

const { hasAuthByRole } = useAccess();
</script>

<template>
  <slot v-if="!codes"></slot>
  <slot v-else-if="hasAuthByRole(codes)"></slot>
</template>
