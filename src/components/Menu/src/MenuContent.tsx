import type { Menu as MenuType } from '/@/router/types';
import { computed, PropType, unref } from 'vue';

import { defineComponent } from 'vue';
import Icon from '/@/components/Icon/index';
import { useI18n } from '/@/hooks/web/useI18n';

export default defineComponent({
  name: 'MenuContent',
  props: {
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

    const getI18nName = computed(() => t(props.item?.name));
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

      const cls = showTitle ? ['show-title'] : ['basic-menu__name'];

      return (
        <>
          {renderIcon(icon!)}
          {
            <span class={[cls]}>
              {name}
              {renderTag()}
            </span>
          }
        </>
      );
    };
  },
});
