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
  value?: string[];
}

defineOptions({
  name: 'CodeAccess',
});

withDefaults(defineProps<Props>(), {
  value: () => [],
});

const { hasAuthByCodes } = useAccess();
</script>

<template>
  <slot v-if="!value"></slot>
  <slot v-else-if="hasAuthByCodes(value)"></slot>
</template>
