<template>
  <MenuItem :key="itemKey">
    <span class="flex items-center">
      <Icon :icon="icon" class="mr-1" />
      <span>{{ text }}</span>
    </span>
  </MenuItem>
</template>
<script lang="ts">
import { Menu } from 'ant-design-vue'
import { computed, defineComponent, getCurrentInstance } from 'vue'
import Icon from '@/components/Icon/index'

export default defineComponent({
  name: 'DropdownMenuItem',
  components: { MenuItem: Menu.Item, Icon },
  props: {
    // eslint-disable-next-line
    key: { type: String },
    text: { type: String },
    icon: { type: String },
  },
  setup(props) {
    const instance = getCurrentInstance()
    const itemKey = computed(() => props.key || instance?.vnode?.props?.key)
    return { itemKey }
  },
})
</script>
