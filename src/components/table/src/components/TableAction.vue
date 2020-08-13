<script lang="tsx">
  import { defineComponent, PropOptions } from 'compatible-vue';
  import { Dropdown, Menu } from 'ant-design-vue';
  import { Icon } from '@/components/icon/index';
  import { useDesign } from '@/hooks/core/useDesign';

  import { ActionItem } from '../types/tableAction';
  export default defineComponent({
    name: 'TableAction',
    props: {
      actions: {
        type: Array,
        default: null,
      } as PropOptions<ActionItem[]>,
      dropDownActions: {
        type: Array,
        default: null,
      } as PropOptions<ActionItem[]>,
    },
    setup(props) {
      const { prefixCls } = useDesign('table-action');

      return () => {
        const { dropDownActions = [], actions } = props;
        return (
          <div class={prefixCls}>
            {actions &&
              actions.length &&
              actions.map((action) => {
                const { disabled = false, on, label, props, icon } = action;
                return (
                  <a-button type="link" size="small" props={props} on={on} disabled={disabled}>
                    {label}
                    {icon && <Icon type={icon} />}
                  </a-button>
                );
              })}
            {dropDownActions && dropDownActions.length && (
              <Dropdown>
                <a-button type="link" size="small">
                  更多
                  <Icon type="down" />
                </a-button>
                (
                <Menu slot="overlay">
                  {dropDownActions.map((action, index) => {
                    const { disabled = false, on, label, props, icon } = action;
                    return (
                      <Menu.Item key={index} disabled={disabled}>
                        <a-button type="link" size="small" {...props} on={on} disabled={disabled}>
                          {label}
                          {icon && <Icon type={icon} />}
                        </a-button>
                      </Menu.Item>
                    );
                  })}
                </Menu>
                )
              </Dropdown>
            )}
          </div>
        );
      };
    },
  });
</script>
<style lang="less" scoped>
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-table-action';
  .@{prefix-cls} {
    display: flex;
  }
</style>
