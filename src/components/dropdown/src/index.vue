<script lang="tsx">
  import { defineComponent, computed, unref } from '@/setup/vue';
  import { Dropdown, Menu } from 'ant-design-vue';
  import { Icon } from '@/components/icon/index';

  import { basicDropdownProps } from './props';
  import { BasicDropdownProps } from './types';
  import { getSlot } from '@/utils/helper/tsxHelper';

  export default defineComponent({
    name: 'Dropdown',
    props: basicDropdownProps,
    setup(props: BasicDropdownProps, { slots, emit }) {
      const getMenuList = computed(() => props.dropMenuList);
      function handleClickMenu({ key }) {
        const menu = unref(getMenuList)[key];
        emit('menuEvent', menu);
      }
      function renderMenus() {
        return (
          <Menu slot="overlay">
            {unref(getMenuList).map((item, index) => {
              const { disabled, icon, text, divider } = item;
              return [
                <Menu.Item key={index} disabled={disabled} onClick={handleClickMenu}>
                  {icon && <Icon type={icon} />}
                  <span>{text}</span>
                </Menu.Item>,
                divider && <Menu.Divider key={`d-${index}`} />,
              ];
            })}
          </Menu>
        );
      }

      return () => (
        <Dropdown props={props}>
          <span>{getSlot(slots, 'default')}</span>
          {renderMenus()}
        </Dropdown>
      );
    },
  });
</script>
