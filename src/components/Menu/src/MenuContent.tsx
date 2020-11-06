import type { Menu as MenuType } from '/@/router/types';
import type { PropType } from 'vue';

import { defineComponent } from 'vue';
import Icon from '/@/components/Icon/index';

export default defineComponent({
  name: 'MenuContent',
  props: {
    searchValue: {
      type: String as PropType<string>,
      default: '',
    },

    item: {
      type: Object as PropType<MenuType>,
      default: null,
    },

    showTitle: {
      type: Boolean as PropType<boolean>,
      default: true,
    },

    level: {
      type: Number as PropType<number>,
      default: 0,
    },
  },
  setup(props) {
    /**
     * @description: 渲染图标
     */
    function renderIcon(icon: string) {
      return icon ? <Icon icon={icon} size={18} class="menu-item-icon" /> : null;
    }

    return () => {
      if (!props.item) {
        return null;
      }
      const { showTitle } = props;
      const { name, icon } = props.item;
      const searchValue = props.searchValue || '';
      const index = name.indexOf(searchValue);

      const beforeStr = name.substr(0, index);
      const afterStr = name.substr(index + searchValue.length);
      return (
        <>
          {renderIcon(icon!)}
          {index > -1 && searchValue ? (
            <span class={showTitle ? 'show-title' : ''}>
              {beforeStr}
              <span class={`basic-menu__keyword`}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span class={[showTitle ? 'show-title' : '']}>{name}</span>
          )}
        </>
      );
    };
  },
});
