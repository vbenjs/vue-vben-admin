import { defineComponent, PropType } from 'vue';
import { Dropdown, Menu, Popconfirm } from 'ant-design-vue';
import Icon from '/@/components/Icon/index';
import { DownOutlined } from '@ant-design/icons-vue';
import { ActionItem } from '/@/components/Table';
import Button from '/@/components/Button/index.vue';
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
    function renderButton(action: ActionItem, index: number) {
      const { disabled = false, label, icon, color = '', type = 'link' } = action;
      const button = (
        <Button
          type={type as any}
          size="small"
          disabled={disabled}
          color={color}
          {...action}
          key={`${index}-${label}`}
        >
          {() => (
            <>
              {label}
              {icon && <Icon icon={icon} />}
            </>
          )}
        </Button>
      );
      return button;
    }

    function renderPopConfirm(action: ActionItem, index: number) {
      const { popConfirm = null } = action;
      if (!popConfirm) {
        return renderButton(action, index);
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
          key={`p-${index}-${title}`}
          title={title}
          onConfirm={confirm}
          onCancel={cancel}
          okText={okText}
          cancelText={cancelText}
          icon={icon}
        >
          {() => renderButton(action, index)}
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
            actions.map((action, index) => {
              return renderPopConfirm(action, index);
            })}
          {dropDownActions && dropDownActions.length && (
            <Dropdown>
              {{
                default: dropdownDefaultSLot,
                overlay: () => {
                  return (
                    <Menu>
                      {{
                        default: () => {
                          return dropDownActions.map((action, index) => {
                            const { disabled = false } = action;
                            return (
                              <Menu.Item key={`${index}`} disabled={disabled}>
                                {() => {
                                  return renderPopConfirm(action, index);
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
