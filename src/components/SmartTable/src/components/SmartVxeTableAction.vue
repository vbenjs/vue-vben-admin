<template>
  <div :class="[prefixCls, getAlign]" @click.stop="onCellClick">
    <template v-for="(action, index) in getActions" :key="`${index}-${action.label}`">
      <template v-if="action.slot">
        <slot name="customButton"></slot>
      </template>
      <template v-else>
        <Tooltip v-if="!action.hasAuth" :title="$t('common.message.noPermission')" color="red">
          <!--   无权限  -->
          <PopConfirmVxeButton disabled v-bind="action">
            <Icon :icon="action.icon" :class="{ 'mr-1': !!action.label }" v-if="action.icon" />
            <template v-if="action.label">{{ action.label }}</template>
          </PopConfirmVxeButton>
        </Tooltip>
        <Tooltip v-else-if="action.tooltip" v-bind="getTooltip(action.tooltip)">
          <PopConfirmVxeButton v-bind="action">
            <Icon :icon="action.icon" :class="{ 'mr-1': !!action.label }" v-if="action.icon" />
            <template v-if="action.label">{{ action.label }}</template>
          </PopConfirmVxeButton>
        </Tooltip>
        <PopConfirmVxeButton v-else v-bind="action">
          <Icon :icon="action.icon" :class="{ 'mr-1': !!action.label }" v-if="action.icon" />
          <template v-if="action.label">{{ action.label }}</template>
        </PopConfirmVxeButton>
      </template>

      <Divider
        type="vertical"
        class="action-divider"
        v-if="divider && index < getActions.length - 1"
      />
    </template>
    <Dropdown
      :trigger="['hover']"
      :dropMenuList="getDropdownList"
      popconfirm
      v-if="dropDownActions && getDropdownList.length > 0"
    >
      <slot name="more"></slot>
      <vxe-button type="text" status="primary" size="small" v-if="!$slots.more">
        更多
        <Icon icon="mdi-light:chevron-down" />
      </vxe-button>
    </Dropdown>
  </div>
</template>
<script lang="ts">
  import type { ActionItem } from '../types/SmartTableActionType';
  import type { TableActionType } from '../types/SmartTableType';

  import { defineComponent, PropType, computed, toRaw, unref } from 'vue';
  import { Divider, Tooltip, TooltipProps } from 'ant-design-vue';
  import { Icon } from '@/components/Icon';
  import { PopConfirmVxeButton } from '@/components/Button';
  import { Dropdown } from '@/components/Dropdown';
  import { useDesign } from '@/hooks/web/useDesign';
  import { useTableContext } from '../hooks/useSmartTableContext';
  import { hasPermission } from '@/utils/auth';
  import { isBoolean, isFunction, isString } from '@/utils/is';
  import { propTypes } from '@/utils/propTypes';
  import { ACTION_COLUMN_FLAG } from '../const';

  export default defineComponent({
    name: 'TableAction',
    components: { Icon, PopConfirmVxeButton, Divider, Dropdown, Tooltip },
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
      stopButtonPropagation: propTypes.bool.def(false),
    },
    setup(props) {
      const { prefixCls } = useDesign('basic-table-action');
      let table: Partial<TableActionType> = {};
      if (!props.outside) {
        table = useTableContext();
      }
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

      const getActions = computed(() => {
        return (toRaw(props.actions) || [])
          .filter((action) => {
            return isIfShow(action);
          })
          .map((action) => {
            const { popConfirm } = action;
            return {
              getPopupContainer: () => unref((table as any)?.wrapRef.value) ?? document.body,
              type: 'text',
              size: 'small',
              status: action.danger ? 'danger' : 'primary',
              ...action,
              ...(popConfirm || {}),
              onConfirm: popConfirm?.confirm,
              onCancel: popConfirm?.cancel,
              enable: !!popConfirm,
              hasAuth: hasPermission(action.auth),
            };
          });
      });

      const getDropdownList = computed((): any[] => {
        //过滤掉隐藏的dropdown,避免出现多余的分割线
        const list = (toRaw(props.dropDownActions) || []).filter((action) => {
          return isIfShow(action);
        });
        return list.map((action, index) => {
          const { label, popConfirm } = action;
          return {
            ...action,
            ...popConfirm,
            onConfirm: popConfirm?.confirm,
            onCancel: popConfirm?.cancel,
            text: label,
            divider: index < list.length - 1 ? props.divider : false,
            hasAuth: hasPermission(action.auth),
            disabled: !hasPermission(action.auth) || action.disabled,
          };
        });
      });

      const getAlign = computed(() => {
        const columns = (table as TableActionType)?.getColumns?.() || [];
        const actionColumn = columns.find((item) => item.flag === ACTION_COLUMN_FLAG);
        return actionColumn?.align ?? 'left';
      });

      function getTooltip(data: string | TooltipProps): TooltipProps {
        return {
          getPopupContainer: () => unref((table as any)?.wrapRef.value) ?? document.body,
          placement: 'bottom',
          ...(isString(data) ? { title: data } : data),
        };
      }

      function onCellClick(e: MouseEvent) {
        if (!props.stopButtonPropagation) return;
        const path = e.composedPath() as HTMLElement[];
        const isInButton = path.find((ele) => {
          return ele.tagName?.toUpperCase() === 'BUTTON';
        });
        isInButton && e.stopPropagation();
      }

      return { prefixCls, getActions, getDropdownList, getAlign, onCellClick, getTooltip };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-basic-table-action';

  .@{prefix-cls} {
    display: flex;
    align-items: center;

    /* update-begin-author:taoyan date:2022-11-18 for: 表格默认行高比官方示例多出2px */
    height: 22px;

    /* update-end-author:taoyan date:2022-11-18 for: 表格默认行高比官方示例多出2px */

    .action-divider {
      display: table;
    }

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

    button.ant-btn-circle {
      span {
        margin: auto !important;
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
