<template>
  <div :class="[prefixCls, getAlign]">
    <template v-for="(action, index) in getActions" :key="`${index}-${action.label}`">
      <PopConfirmButton v-bind="action">
        <Icon :icon="action.icon" class="mr-1" v-if="action.icon" />
        {{ action.label }}
      </PopConfirmButton>
      <Divider
        type="vertical"
        v-if="divider && index < getActions.length - (dropDownActions ? 0 : 1)"
      />
    </template>
    <Dropdown :trigger="['hover']" :dropMenuList="getDropList" v-if="dropDownActions">
      <slot name="more"></slot>
      <a-button type="link" size="small" v-if="!$slots.more">
        <MoreOutlined class="icon-more" />
      </a-button>
    </Dropdown>
  </div>
</template>
<script lang="ts">
  import { defineComponent, PropType, computed, toRaw } from 'vue';

  import { MoreOutlined } from '@ant-design/icons-vue';
  import Icon from '/@/components/Icon/index';
  import { ActionItem, TableActionType } from '/@/components/Table';
  import { PopConfirmButton } from '/@/components/Button';
  import { Divider } from 'ant-design-vue';
  import { Dropdown } from '/@/components/Dropdown';

  import { useDesign } from '/@/hooks/web/useDesign';
  import { useTableContext } from '../hooks/useTableContext';

  import { propTypes } from '/@/utils/propTypes';
  import { ACTION_COLUMN_FLAG } from '../const';

  export default defineComponent({
    name: 'TableAction',
    components: { Icon, PopConfirmButton, Divider, Dropdown, MoreOutlined },
    props: {
      actions: {
        type: Array as PropType<ActionItem[]>,
        default: null,
      },
      dropDownActions: {
        type: Array as PropType<ActionItem[]>,
        default: null,
      },
      divider: propTypes.bool.def(true),
      outside: propTypes.bool,
    },
    setup(props) {
      const { prefixCls } = useDesign('basic-table-action');
      let table: Partial<TableActionType> = {};
      if (!props.outside) {
        table = useTableContext();
      }

      const getActions = computed(() => {
        return (toRaw(props.actions) || []).map((action) => {
          const { popConfirm } = action;
          return {
            type: 'link',
            size: 'small',
            ...action,
            ...(popConfirm || {}),
            onConfirm: popConfirm?.confirm,
            onCancel: popConfirm?.cancel,
            enable: !!popConfirm,
          };
        });
      });

      const getDropList = computed(() => {
        return (toRaw(props.dropDownActions) || []).map((action, index) => {
          const { label } = action;
          return {
            ...action,
            text: label,
            divider: index < props.dropDownActions.length - 1 ? props.divider : false,
          };
        });
      });

      const getAlign = computed(() => {
        const columns = (table as TableActionType)?.getColumns?.() || [];
        const actionColumn = columns.find((item) => item.flag === ACTION_COLUMN_FLAG);
        return actionColumn?.align ?? 'left';
      });

      return { prefixCls, getActions, getDropList, getAlign };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-basic-table-action';

  .@{prefix-cls} {
    display: flex;
    align-items: center;

    &.left {
      justify-content: flex-start;
    }

    &.center {
      justify-content: center;
    }

    &.right {
      justify-content: flex-end;
    }

    button {
      display: flex;
      align-items: center;

      span {
        margin-left: 0 !important;
      }
    }

    .ant-divider,
    .ant-divider-vertical {
      margin: 0 2px;
    }

    .icon-more {
      transform: rotate(90deg);

      svg {
        font-size: 1.1em;
        font-weight: 700;
      }
    }
  }
</style>
