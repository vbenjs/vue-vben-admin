<template>
  <a-dropdown :trigger="trigger" v-bind="$attrs">
    <span>
      <slot></slot>
    </span>
    <template #overlay>
      <a-menu :selectedKeys="selectedKeys">
        <template v-for="item in dropMenuList" :key="`${item.event}`">
          <a-menu-item
            v-bind="getAttr(item.event)"
            @click="handleClickMenu(item)"
            :disabled="item.disabled"
          >
            <Popconfirm v-if="popconfirm" v-bind="item">
              <Icon :icon="item.icon" v-if="item.icon" />
              <span class="ml-1">{{ item.text }}</span>
            </Popconfirm>
            <template v-else>
              <Icon :icon="item.icon" v-if="item.icon" />
              <span class="ml-1">{{ item.text }}</span>
            </template>
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

  import { defineComponent } from 'vue';
  import { Dropdown, Menu, Popconfirm } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';

  export default defineComponent({
    name: 'BasicDropdown',
    components: {
      [Dropdown.name]: Dropdown,
      [Menu.name]: Menu,
      [Menu.Item.name]: Menu.Item,
      [Menu.Divider.name]: Menu.Divider,
      Icon,
      Popconfirm,
    },
    props: {
      popconfirm: Boolean,
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
      function handleClickMenu(item: DropMenu) {
        const { event } = item;
        const menu = props.dropMenuList.find((item) => `${item.event}` === `${event}`);
        emit('menuEvent', menu);
        item.onClick?.();
      }
      return {
        handleClickMenu,
        getAttr: (key: string | number) => ({ key }),
      };
    },
  });
</script>
