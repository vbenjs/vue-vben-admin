import type { Trigger } from './types';

import { defineComponent, computed, unref } from 'vue';
import { Dropdown, Menu } from 'ant-design-vue';
import Icon from '/@/components/Icon/index';

import { basicDropdownProps } from './props';
import { getSlot } from '/@/utils/helper/tsxHelper';

export default defineComponent({
  name: 'Dropdown',
  props: basicDropdownProps,
  emits: ['menuEvent'],
  setup(props, { slots, emit, attrs }) {
    const getMenuList = computed(() => props.dropMenuList);

    function handleClickMenu({ key }: any) {
      const menu = unref(getMenuList).find((item) => `${item.event}` === `${key}`);
      emit('menuEvent', menu);
    }

    function renderMenus() {
      return (
        <Menu onClick={handleClickMenu} selectedKeys={props.selectedKeys}>
          {() => (
            <>
              {unref(getMenuList).map((item) => {
                const { disabled, icon, text, divider, event } = item;
                return [
                  <Menu.Item key={`${event}`} disabled={disabled}>
                    {() => (
                      <>
                        {icon && <Icon icon={icon} />}
                        <span class="ml-1">{text}</span>
                      </>
                    )}
                  </Menu.Item>,
                  // @ts-ignore
                  divider && <Menu.Divider key={`d-${event}`} />,
                ];
              })}
            </>
          )}
        </Menu>
      );
    }

    return () => (
      <Dropdown trigger={props.trigger as Trigger[]} {...attrs}>
        {{
          default: () => <span>{getSlot(slots)}</span>,
          overlay: () => renderMenus(),
        }}
      </Dropdown>
    );
  },
});
