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
  value?: string[];
}

defineOptions({
  name: 'Authority',
});

withDefaults(defineProps<Props>(), {
  value: undefined,
});
</script>

<template>
  <slot></slot>
</template>
