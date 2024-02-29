<template>
  <Menu.Item :key="itemKey">
    <span class="flex items-center">
      <Icon :icon="props.icon" class="mr-1" />
      <span>{{ props.text }}</span>
    </span>
  </Menu.Item>
</template>
<script lang="ts" setup>
  import { Menu } from 'ant-design-vue';
  import { computed, getCurrentInstance, useAttrs } from 'vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { propTypes } from '@/utils/propTypes';

  defineOptions({ name: 'DropdownMenuItem' });

  const props = defineProps({
    // eslint-disable-next-line
    text: propTypes.string,
    icon: propTypes.string,
  });

  const attrs = useAttrs();

  const instance = getCurrentInstance();
  const itemKey = computed(
    () => (attrs.key || instance?.vnode?.props?.key) as string | number | undefined,
  );
</script>
