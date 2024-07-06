<!--
 Access control component for fine-grained access control.
-->
<script lang="ts" setup>
import { useAccess } from './use-access';

interface Props {
  /**
   * Specified role is visible
   * @default []
   */
  value?: string[];
}

defineOptions({
  name: 'RoleAuthority',
});

withDefaults(defineProps<Props>(), {
  value: undefined,
});

const { hasAuthByRoles } = useAccess();
</script>

<template>
  <slot v-if="!value"></slot>
  <slot v-else-if="hasAuthByRoles(value)"></slot>
</template>
