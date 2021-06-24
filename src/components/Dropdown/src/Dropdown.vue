<template>
  <Dropdown :trigger="trigger" v-bind="$attrs">
    <span>
      <slot></slot>
    </span>
    <template #overlay>
      <Menu :selectedKeys="selectedKeys">
        <template v-for="item in dropMenuList" :key="`${item.event}`">
          <MenuItem
            v-bind="getAttr(item.event)"
            @click="handleClickMenu(item)"
            :disabled="item.disabled"
          >
            <Popconfirm
              v-if="popconfirm && item.popConfirm"
              v-bind="getPopConfirmAttrs(item.popConfirm)"
            >
              <template #icon v-if="item.popConfirm.icon">
                <Icon :icon="item.popConfirm.icon" />
              </template>
              <div>
                <Icon :icon="item.icon" v-if="item.icon" />
                <span class="ml-1">{{ item.text }}</span>
              </div>
            </Popconfirm>
            <template v-else>
              <Icon :icon="item.icon" v-if="item.icon" />
              <span class="ml-1">{{ item.text }}</span>
            </template>
          </MenuItem>
          <MenuDivider v-if="item.divider" :key="`d-${item.event}`" />
        </template>
      </Menu>
    </template>
  </Dropdown>
</template>

<script lang="ts">
  import { computed, PropType } from 'vue';
  import type { DropMenu } from './typing';

  import { defineComponent } from 'vue';
  import { Dropdown, Menu, Popconfirm } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';
  import { omit } from 'lodash-es';
  import { isFunction } from '/@/utils/is';

  export default defineComponent({
    name: 'BasicDropdown',
    components: {
      Dropdown,
      Menu,
      MenuItem: Menu.Item,
      MenuDivider: Menu.Divider,
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
        type: [Array] as PropType<('contextmenu' | 'click' | 'hover')[]>,
        default: () => {
          return ['contextmenu'];
        },
      },
      dropMenuList: {
        type: Array as PropType<(DropMenu & Recordable)[]>,
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

      const getPopConfirmAttrs = computed(() => {
        return (attrs) => {
          const originAttrs = omit(attrs, ['confirm', 'cancel', 'icon']);
          if (!attrs.onConfirm && attrs.confirm && isFunction(attrs.confirm))
            originAttrs['onConfirm'] = attrs.confirm;
          if (!attrs.onCancel && attrs.cancel && isFunction(attrs.cancel))
            originAttrs['onCancel'] = attrs.cancel;
          return originAttrs;
        };
      });

      return {
        handleClickMenu,
        getPopConfirmAttrs,
        getAttr: (key: string | number) => ({ key }),
      };
    },
  });
</script>
