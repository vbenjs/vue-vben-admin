<!--
 Access control component for fine-grained access control.
-->
<script lang="ts" setup>
import { computed } from 'vue';

import { useAccess } from './use-access';

interface Props {
  /**
   * 通过什么方式来控制组件，如果是 role，则传入角色，如果是 code，则传入权限码
   * @default 'role'
   */
  type?: 'code' | 'role';

  /**
   * Specified codes is visible
   * @default []
   */
  value?: string[];
}

defineOptions({
  name: 'AccessControl',
});

const props = withDefaults(defineProps<Props>(), {
  type: 'role',
  value: () => [],
});

const { hasAuthByCodes, hasAuthByRoles } = useAccess();

const hasAuth = computed(() => {
  const { type, value } = props;
  return type === 'role' ? hasAuthByRoles(value) : hasAuthByCodes(value);
});
</script>

<template>
  <slot v-if="!value"></slot>
  <slot v-else-if="hasAuth"></slot>
</template>
