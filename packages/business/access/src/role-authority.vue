<!--
 Access control component for fine-grained access control.
-->
<script lang="ts" setup>
interface Props {
  /**
   * Specified role is visible
   * - When the permission mode is 'frontend', the value can be a role value.
   * - When the permission mode is 'backend', the value can be a code permission value.
   * @default ''
   */
  roles?: string[];
}

defineOptions({
  name: 'FrontendAuthority',
});

withDefaults(defineProps<Props>(), {
  roles: undefined,
});
</script>

<template>
  <slot></slot>
</template>
