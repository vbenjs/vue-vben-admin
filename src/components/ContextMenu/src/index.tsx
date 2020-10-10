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
      const { handler, disabled } = item;
      if (disabled) {
        return;
      }
      state.show = false;
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
        <span style="display: inline-block; width: 100%;">
          {showIcon && icon && <Icon class="mr-2" icon={icon} />}
          <span>{label}</span>
        </span>
      );
    }
    function renderMenuItem(items: ContextMenuItem[]) {
      return items.map((item) => {
        const { disabled, label } = item;

        return (
          <li class={`${prefixCls}__item ${disabled ? 'disabled' : ''}`} key={label}>
            <a onClick={handleAction.bind(null, item)} style="color:#333;">
              {renderContent(item)}
            </a>
          </li>
        );
      });
    }
    return () => {
      const { items } = props;
      return (
        <ul class={[prefixCls, !state.show && 'hidden']} ref={wrapRef} style={unref(getStyle)}>
          {renderMenuItem(items)}
        </ul>
      );
    };
  },
});
