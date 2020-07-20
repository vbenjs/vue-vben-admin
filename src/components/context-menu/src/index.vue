<script lang="tsx">
  import {
    defineComponent,
    nextTick,
    onMounted,
    reactive,
    computed,
    ref,
    unref,
    onUnmounted,
  } from 'compatible-vue';
  import { Icon } from '@/components/icon/index';
  import { Menu, Divider } from 'ant-design-vue';
  import { props } from './props';
  import { Props, ContextMenuItem } from './types';

  import { useDesign } from '@/hooks/core/useDesign';
  export default defineComponent({
    name: 'ContextMenu',
    props,
    setup(props: Props) {
      const { prefixCls } = useDesign('context-menu');
      const wrapRef = ref<HTMLDivElement | null>(null);
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
          ...styles,
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
        e.stopPropagation();
        e.preventDefault();
        handler && handler();
      }
      function renderContent(item: ContextMenuItem) {
        const { icon, label } = item;

        const { showIcon } = props;
        return (
          <span style="display: inline-block; width: 100%;" onClick={handleAction.bind(null, item)}>
            {showIcon && icon && <Icon class="mr-2" type={icon} />}
            <span>{label}</span>
          </span>
        );
      }
      function renderMenuItem(items: ContextMenuItem[]) {
        return items.map((item, index) => {
          const { disabled, label, children, divider = true } = item;

          const DividerComp = divider ? <Divider key={`d-${index}`} /> : null;
          if (!children || children.length === 0) {
            return [
              <Menu.Item disabled={disabled} class={`${prefixCls}__item`} key={label}>
                {renderContent(item)}
              </Menu.Item>,
              DividerComp,
            ];
          }
          return (
            <Menu.SubMenu key={label} popupClassName={`${prefixCls}__popup`}>
              <span slot="title"> {renderContent(item)}</span>
              {renderMenuItem(children)}
            </Menu.SubMenu>
          );
        });
      }
      return () => {
        const { items } = props;
        return (
          <Menu
            inlineIndent={12}
            mode="inline"
            v-show={state.show}
            class={prefixCls}
            ref={wrapRef}
            style={unref(getStyle)}
          >
            {renderMenuItem(items)}
          </Menu>
        );
      };
    },
  });
</script>
<style lang="less">
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-context-menu';

  .@{prefix-cls} {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 300;
    display: block;
    width: 156px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
    user-select: none;

    &__item {
      height: 36px;
      margin-bottom: 0 !important;
      line-height: 36px;

      &:hover:not(.ant-menu-item-disabled) {
        color: inherit;
        cursor: pointer;
        background: fade(@primary-color, 10%);
      }
    }

    .ant-divider {
      margin: 0 0;
    }
  }
</style>
