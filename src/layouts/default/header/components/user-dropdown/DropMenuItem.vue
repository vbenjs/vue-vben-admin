<template>
  <Menu.Item :key="itemKey">
    <span class="flex items-center">
      <Icon :icon="icon" class="mr-1" />
      <span>{{ text }}</span>
    </span>
  </Menu.Item>
</template>
<script lang="ts" setup>
  import { Menu } from 'ant-design-vue';
  import { computed, getCurrentInstance } from 'vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { propTypes } from '@/utils/propTypes';

  defineOptions({ name: 'DropdownMenuItem' });

  const props = defineProps({
    // eslint-disable-next-line
    key: propTypes.string,
    text: propTypes.string,
    icon: propTypes.string,
  });

  const instance = getCurrentInstance();
  const itemKey = computed(() => props.key || instance?.vnode?.props?.key);
</script>
