<template>
  <a-dropdown :trigger="trigger" v-bind="$attrs">
    <span>
      <slot></slot>
    </span>
    <template #overlay>
      <a-menu :selectedKeys="selectedKeys">
        <template v-for="item in getMenuList" :key="`${item.event}`">
          <a-menu-item @click="handleClickMenu(item)" :disabled="item.disabled">
            <Icon :icon="item.icon" v-if="item.icon" />
            <span class="ml-1">{{ item.text }}</span>
          </a-menu-item>
          <a-menu-divider v-if="item.divider" :key="`d-${item.event}`" />
        </template>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script lang="ts">
  import type { PropType } from 'vue';
  import type { DropMenu } from './types';

  import { defineComponent, computed, unref } from 'vue';
  import { Dropdown, Menu } from 'ant-design-vue';
  import Icon from '/@/components/Icon/index';

  export default defineComponent({
    name: 'BasicDropdown',
    components: {
      [Dropdown.name]: Dropdown,
      [Menu.name]: Menu,
      [Menu.Item.name]: Menu.Item,
      [Menu.Divider.name]: Menu.Divider,
      Icon,
    },
    props: {
      /**
       * the trigger mode which executes the drop-down action
       * @default ['hover']
       * @type string[]
       */
      trigger: {
        type: [Array] as PropType<string[]>,
        default: () => {
          return ['contextmenu'];
        },
      },
      dropMenuList: {
        type: Array as PropType<DropMenu[]>,
        default: () => [],
      },
      selectedKeys: {
        type: Array as PropType<string[]>,
        default: () => [],
      },
    },
    emits: ['menuEvent'],
    setup(props, { emit }) {
      const getMenuList = computed(() => props.dropMenuList);

      function handleClickMenu(item: DropMenu) {
        const { event } = item;
        const menu = unref(getMenuList).find((item) => `${item.event}` === `${event}`);
        emit('menuEvent', menu);
        item.onClick?.();
      }

      return { handleClickMenu, getMenuList };
    },
  });
</script>
