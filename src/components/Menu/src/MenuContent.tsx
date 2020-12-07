import type { Menu as MenuType } from '/@/router/types';
import type { PropType } from 'vue';
import { computed, unref } from 'vue';

import { defineComponent } from 'vue';
import Icon from '/@/components/Icon/index';
import { useI18n } from '/@/hooks/web/useI18n';
import { useDesign } from '/@/hooks/web/useDesign';

const { t } = useI18n();

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
    const { prefixCls } = useDesign('basic-menu');

    const getI18nName = computed(() => t(props.item?.name));

    const getTagClass = computed(() => {
      const { item } = props;
      const { tag = {} } = item || {};
      const { dot, type = 'error' } = tag;
      return [
        `${prefixCls}__tag`,
        type,
        {
          dot,
        },
      ];
    });

    const getNameClass = computed(() => {
      const { showTitle } = props;
      return { [`${prefixCls}--show-title`]: showTitle, [`${prefixCls}__name`]: !showTitle };
    });

    /**
     * @description: 渲染图标
     */
    function renderIcon(icon?: string) {
      return icon ? <Icon icon={icon} size={18} class="menu-item-icon" /> : null;
    }

    function renderTag() {
      const { item, showTitle, isHorizontal } = props;
      if (!item || showTitle || isHorizontal) return null;

      const { tag } = item;
      if (!tag) return null;

      const { dot, content } = tag;
      if (!dot && !content) return null;

      return <span class={unref(getTagClass)}>{dot ? '' : content}</span>;
    }

    return () => {
      const { item } = props;
      if (!item) {
        return null;
      }
      const { icon } = item;
      const name = unref(getI18nName);

      return (
        <span class={`${prefixCls}__content-wrapper`}>
          {renderIcon(icon)}
          {
            <span class={unref(getNameClass)}>
              {name}
              {renderTag()}
            </span>
          }
        </span>
      );
    };
  },
});
