import { defineComponent, PropType } from 'vue';
import { Dropdown, Menu, Popconfirm } from 'ant-design-vue';
import Icon from '/@/components/Icon/index';
import { DownOutlined } from '@ant-design/icons-vue';
import { ActionItem } from '../types/tableAction';
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
  },
  setup(props) {
    // 增加按钮的TYPE和COLOR
    return () => {
      const { dropDownActions = [], actions } = props;
      return (
        <div class={prefixCls}>
          {actions &&
            actions.length &&
            actions.map((action, index) => {
              const {
                disabled = false,
                label,
                props,
                icon,
                color = '',
                type = 'link',
                popConfirm = null,
              } = action;
              const button = (
                <Button
                  type={type}
                  size="small"
                  disabled={disabled}
                  color={color}
                  {...props}
                  key={index}
                >
                  {() => (
                    <>
                      {label}
                      {icon && <Icon icon={icon} />}
                    </>
                  )}
                </Button>
              );
              if (popConfirm !== null) {
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
                    key={`P-${index}`}
                    title={title}
                    onConfirm={confirm}
                    onCancel={cancel}
                    okText={okText}
                    cancelText={cancelText}
                    icon={icon}
                  >
                    {() => button}
                  </Popconfirm>
                );
              }
              return button;
            })}
          {dropDownActions && dropDownActions.length && (
            <Dropdown>
              {{
                default: () => (
                  <Button type="link" size="small">
                    {{
                      default: () => (
                        <>
                          更多
                          <DownOutlined />
                        </>
                      ),
                    }}
                  </Button>
                ),
                overlay: () => {
                  return (
                    <Menu>
                      {{
                        default: () => {
                          return dropDownActions.map((action, index) => {
                            const {
                              disabled = false,
                              label,
                              props,
                              icon,
                              color = '',
                              type = 'link',
                            } = action;
                            return (
                              <Menu.Item key={`${index}`} disabled={disabled}>
                                {() => (
                                  <Button
                                    type={type}
                                    size="small"
                                    {...props}
                                    disabled={disabled}
                                    color={color}
                                  >
                                    {{
                                      default: () => (
                                        <>
                                          {label}
                                          {icon && <Icon icon={icon} />}
                                        </>
                                      ),
                                    }}
                                  </Button>
                                )}
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
