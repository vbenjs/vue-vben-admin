<template>
  <div v-if="getDropdownList?.length">
    <Dropdown :trigger="['hover']" :dropMenuList="getDropdownList" popconfirm>
      <Icon icon="ant-design:more-outlined" />
    </Dropdown>
  </div>
</template>
<script lang="ts" setup>
  import { computed, toRaw } from 'vue';
  import { Dropdown } from '@/components/Dropdown';
  import { isBoolean, isFunction } from '@/utils/is';
  import { Icon } from '@/components/Icon';
  import { usePermission } from '@/hooks/web/usePermission';
  import { ActionItem } from '@/components/Table';

  const { hasPermission } = usePermission();

  interface Props {
    dropMenuList?: ActionItem[];
  }

  const props = withDefaults(defineProps<Props>(), {});

  function isIfShow(action: ActionItem): boolean {
    const ifShow = action.ifShow;

    let isIfShow = true;

    if (isBoolean(ifShow)) {
      isIfShow = ifShow;
    }
    if (isFunction(ifShow)) {
      isIfShow = ifShow(action);
    }
    return isIfShow;
  }

  const getDropdownList = computed((): any[] => {
    const list = (toRaw(props.dropMenuList) || []).filter((action) => {
      return hasPermission(action.auth) && isIfShow(action);
    });
    return list.map((action, index) => {
      const { label, popConfirm } = action;
      return {
        ...action,
        ...popConfirm,
        onConfirm: popConfirm?.confirm,
        onCancel: popConfirm?.cancel,
        text: label,
        divider: index < list.length - 1,
        color: action.color || 'primary',
      };
    });
  });
</script>
