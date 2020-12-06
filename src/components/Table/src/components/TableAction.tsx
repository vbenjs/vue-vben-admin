import { defineComponent, PropType } from 'vue';
import { Dropdown, Menu, Popconfirm } from 'ant-design-vue';
import Icon from '/@/components/Icon/index';
import { DownOutlined } from '@ant-design/icons-vue';
import { ActionItem } from '/@/components/Table';
import { Button } from '/@/components/Button';
import { snowUuid } from '/@/utils/uuid';
const prefixCls = 'basic-table-action';
export default defineComponent({
  name: 'TableAction',
  props: {
    actions: {
      type: Array as PropType<ActionItem[]>,
      default: null,
    },
    dropDownActions: {
      type: Array as PropType<ActionItem[]>,
      default: null,
    },

    moreText: {
      type: String as PropType<string>,
      default: '更多',
    },
  },
  setup(props) {
    function renderButton(action: ActionItem) {
      const { disabled = false, label, icon, color = '', type = 'link', ...actionProps } = action;
      const button = (
        <Button
          type={type}
          size="small"
          disabled={disabled}
          color={color}
          {...actionProps}
          key={`${snowUuid()}`}
        >
          {() => (
            <>
              {icon && <Icon icon={icon} class="mr-1" />}
              {label}
            </>
          )}
        </Button>
      );
      return button;
    }

    function renderPopConfirm(action: ActionItem) {
      const { popConfirm = null } = action;
      if (!popConfirm) {
        return renderButton(action);
      }
      const {
        title,
        okText = '确定',
        cancelText = '取消',
        confirm = () => {},
        cancel = () => {},
        icon = '',
      } = popConfirm;
      return (
        <Popconfirm
          key={`${snowUuid()}`}
          title={title}
          onConfirm={confirm}
          onCancel={cancel}
          okText={okText}
          cancelText={cancelText}
          icon={icon}
        >
          {() => renderButton(action)}
        </Popconfirm>
      );
    }

    const dropdownDefaultSLot = () => (
      <Button type="link" size="small">
        {{
          default: () => (
            <>
              {props.moreText}
              <DownOutlined />
            </>
          ),
        }}
      </Button>
    );

    // 增加按钮的TYPE和COLOR
    return () => {
      const { dropDownActions = [], actions } = props;
      return (
        <div class={prefixCls}>
          {actions &&
            actions.map((action) => {
              return renderPopConfirm(action);
            })}
          {dropDownActions && dropDownActions.length && (
            <Dropdown overlayClassName="basic-tale-action-dropdown">
              {{
                default: dropdownDefaultSLot,
                overlay: () => {
                  return (
                    <Menu>
                      {{
                        default: () => {
                          return dropDownActions.map((action) => {
                            const { disabled = false } = action;
                            action.ghost = true;
                            return (
                              <Menu.Item key={`${snowUuid()}`} disabled={disabled}>
                                {() => {
                                  return renderPopConfirm(action);
                                }}
                              </Menu.Item>
                            );
                          });
                        },
                      }}
                    </Menu>
                  );
                },
              }}
            </Dropdown>
          )}
        </div>
      );
    };
  },
});
