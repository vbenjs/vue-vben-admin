import {
  defineComponent,
  nextTick,
  onMounted,
  reactive,
  computed,
  ref,
  unref,
  onUnmounted,
} from 'vue';

import { props } from './props';
import Icon from '/@/components/Icon';
import { Menu, Divider } from 'ant-design-vue';

import type { ContextMenuItem } from './types';

import './index.less';
const prefixCls = 'context-menu';
export default defineComponent({
  name: 'ContextMenu',
  props,
  setup(props) {
    const wrapRef = ref<Nullable<HTMLDivElement>>(null);
    const state = reactive({
      show: false,
    });

    onMounted(() => {
      nextTick(() => {
        state.show = true;
      });
    });

    onUnmounted(() => {
      const el = unref(wrapRef);
      el && document.body.removeChild(el);
    });
    const getStyle = computed(() => {
      const { axis, items, styles, width } = props;
      const { x, y } = axis || { x: 0, y: 0 };
      const menuHeight = (items || []).length * 40;
      const menuWidth = width;
      const body = document.body;
      return {
        ...(styles as any),
        width: `${width}px`,
        left: (body.clientWidth < x + menuWidth ? x - menuWidth : x) + 'px',
        top: (body.clientHeight < y + menuHeight ? y - menuHeight : y) + 'px',
      };
    });

    function handleAction(item: ContextMenuItem, e: MouseEvent) {
      state.show = false;
      const { handler, disabled } = item;
      if (disabled) {
        return;
      }
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }

      handler && handler();
    }

    function renderContent(item: ContextMenuItem) {
      const { icon, label } = item;

      const { showIcon } = props;
      return (
        <span style="display: inline-block; width: 100%;" onClick={handleAction.bind(null, item)}>
          {showIcon && icon && <Icon class="mr-2" icon={icon} />}
          <span>{label}</span>
        </span>
      );
    }

    function renderMenuItem(items: ContextMenuItem[]) {
      return items.map((item, index) => {
        const { disabled, label, children, divider = false } = item;

        const DividerComp = divider ? <Divider key={`d-${index}`} /> : null;
        if (!children || children.length === 0) {
          return [
            <Menu.Item disabled={disabled} class={`${prefixCls}__item`} key={label}>
              {() => [renderContent(item)]}
            </Menu.Item>,
            DividerComp,
          ];
        }
        return !state.show ? null : (
          <Menu.SubMenu key={label} disabled={disabled} popupClassName={`${prefixCls}__popup `}>
            {{
              title: () => renderContent(item),
              default: () => [renderMenuItem(children)],
            }}
          </Menu.SubMenu>
        );
      });
    }
    return () => {
      const { items } = props;
      return !state.show ? null : (
        <Menu
          inlineIndent={12}
          mode="vertical"
          class={[prefixCls]}
          ref={wrapRef}
          style={unref(getStyle)}
        >
          {() => renderMenuItem(items)}
        </Menu>
      );
    };
  },
});
