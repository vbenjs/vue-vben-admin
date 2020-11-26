import type { Menu as MenuType } from '/@/router/types';
import { computed, PropType, unref } from 'vue';

import { defineComponent } from 'vue';
import Icon from '/@/components/Icon/index';
import { useI18n } from '/@/hooks/web/useI18n';

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
    isHorizontal: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
  },
  setup(props) {
    const { t } = useI18n();

    const getI18nName = computed(() => {
      const { name } = props.item;

      return t(name);
    });
    /**
     * @description: 渲染图标
     */
    function renderIcon(icon: string) {
      return icon ? <Icon icon={icon} size={18} class="menu-item-icon" /> : null;
    }

    function renderTag() {
      const { item, showTitle, isHorizontal } = props;
      if (!item || showTitle || isHorizontal) return null;

      const { tag } = item;
      if (!tag) return null;

      const { dot, content, type = 'error' } = tag;
      if (!dot && !content) return null;
      const cls = ['basic-menu__tag'];

      dot && cls.push('dot');
      type && cls.push(type);

      return <span class={cls}>{dot ? '' : content}</span>;
    }

    return () => {
      if (!props.item) {
        return null;
      }
      const { showTitle } = props;
      const { icon } = props.item;
      const name = unref(getI18nName);
      const searchValue = props.searchValue || '';
      const index = name.indexOf(searchValue);

      const beforeStr = name.substr(0, index);
      const afterStr = name.substr(index + searchValue.length);
      const cls = showTitle ? ['show-title'] : ['basic-menu__name'];

      return (
        <>
          {renderIcon(icon!)}
          {index > -1 && searchValue ? (
            <span class={cls}>
              {beforeStr}
              <span class={`basic-menu__keyword`}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span class={[cls]}>
              {name}
              {renderTag()}
            </span>
          )}
        </>
      );
    };
  },
});
