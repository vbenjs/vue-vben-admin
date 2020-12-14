<template>
  <MenuItem :key="key">
    <span class="flex items-center">
      <Icon :icon="icon" class="mr-1" />
      <span>{{ text }}</span>
    </span>
  </MenuItem>
</template>
<script lang="ts">
  // components
  import { Menu } from 'ant-design-vue';

  import { defineComponent } from 'vue';

  import Icon from '/@/components/Icon/index';
  import { propTypes } from '/@/utils/propTypes';

  export default defineComponent({
    name: 'DropdownMenuItem',
    components: { MenuItem: Menu.Item, Icon },
    props: {
      key: propTypes.string,
      text: propTypes.string,
      icon: propTypes.string,
    },
  });
</script>
