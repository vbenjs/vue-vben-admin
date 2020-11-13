import { defineComponent, computed, unref } from 'vue';
import { Dropdown, Menu } from 'ant-design-vue';

import Icon from '/@/components/Icon/index';

import { basicDropdownProps } from './props';
import { getSlot } from '/@/utils/helper/tsxHelper';

export default defineComponent({
  name: 'Dropdown',
  props: basicDropdownProps,
  setup(props, { slots, emit, attrs }) {
    const getMenuList = computed(() => props.dropMenuList);

    function handleClickMenu({ key }: any) {
      const menu = unref(getMenuList)[key];
      emit('menuEvent', menu);
    }

    function renderMenus() {
      return (
        <Menu onClick={handleClickMenu}>
          {() => (
            <>
              {unref(getMenuList).map((item, index) => {
                const { disabled, icon, text, divider } = item;

                return [
                  <Menu.Item key={`${index}`} disabled={disabled}>
                    {() => (
                      <>
                        {icon && <Icon icon={icon} />}
                        <span class="ml-1">{text}</span>
                      </>
                    )}
                  </Menu.Item>,
                  // @ts-ignore
                  divider && <Menu.Divider key={`d-${index}`} />,
                ];
              })}
            </>
          )}
        </Menu>
      );
    }

    return () => (
      <Dropdown trigger={props.trigger as any} {...attrs}>
        {{
          default: () => <span>{getSlot(slots)}</span>,
          overlay: () => renderMenus(),
        }}
      </Dropdown>
    );
  },
});
