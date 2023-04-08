<template>
  <MenuItem :key="itemKey">
    <span class="flex items-center">
      <VbenIcon :icon="icon" class="mr-1" />
      <span>{{ text }}</span>
    </span>
  </MenuItem>
</template>
<script lang="ts">
  import { VbenIcon } from '@vben/icons';
  import { Menu } from 'ant-design-vue';
  import { computed, defineComponent, getCurrentInstance } from 'vue';

  import { propTypes } from '@/utils/propTypes';

  export default defineComponent({
    name: 'DropdownMenuItem',
    components: { MenuItem: Menu.Item, VbenIcon },
    props: {
      // eslint-disable-next-line
      key: propTypes.string,
      text: propTypes.string,
      icon: propTypes.string,
    },
    setup(props) {
      const instance = getCurrentInstance();
      const itemKey = computed(() => props.key || instance?.vnode?.props?.key);
      return { itemKey };
    },
  });
</script>
