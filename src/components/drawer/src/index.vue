<script lang="tsx">
  import { Drawer, Button } from 'ant-design-vue';
  import { defineComponent, ref, computed, watch, unref } from 'compatible-vue';
  // import { BaseTitle } from '@/components/base/index';
  import { Icon } from '@/components/icon/index';
  import { BaseTitle } from '@/components/base/index';
  import { ScrollContainer, ScrollContainerOptions } from '@/components/container/index';
  import { FullLoading } from '@/components/loading/index';

  import { getSlot } from '@/utils/helper/tsxHelper';

  import { useDesign } from '@/hooks/core/useDesign';
  import { DrawerInstance, DrawerProps, DrawerType } from './types';

  import { basicProps } from './props';
  import { isFunction } from '@/utils/is';
  export default defineComponent({
    props: basicProps,
    setup(props: DrawerProps, { slots, emit, listeners, root, attrs }) {
      const { prefixCls, prefixVar } = useDesign('drawer');
      /**
       * @description: 获取配置ScrollContainer
       */
      const getScrollOptions = computed(
        (): ScrollContainerOptions => {
          return {
            ...props.scrollOptions,
          };
        }
      );
      const visibleRef = ref(false);
      const propsRef = ref<Partial<DrawerProps> | null>(null);

      // 自定义title组件：获得title
      const getMergeProps = computed(() => {
        return {
          ...props,
          ...unref(propsRef),
        };
      });

      const getProps = computed(() => {
        const opt: any = {
          ...attrs,
          ...props,
          ...unref(propsRef),
          visible: unref(visibleRef),
        };
        opt.title = undefined;

        if (opt.drawerType === DrawerType.DETAIL) {
          opt.width = '100%';
          opt.wrapClassName = opt.wrapClassName
            ? `${opt.wrapClassName} ${prefixCls}__detail`
            : `${prefixCls}__detail`;
          opt.maskClosable = false;
          opt.getContainer = `${prefixVar}-default-layout__content`;
        }
        return opt;
      });
      watch(
        () => props.visible,
        (visible) => {
          visibleRef.value = visible;
        },
        {
          immediate: true,
        }
      );
      watch(
        () => visibleRef.value,
        (visible) => {
          root.$nextTick(() => {
            emit('visibleChange', visible);
          });
        },
        {
          immediate: false,
        }
      );
      // 取消事件
      async function onClose(e) {
        const { closeFunc } = unref(getProps);
        emit('close', e);
        if (closeFunc && isFunction(closeFunc)) {
          const res = await closeFunc();
          res && (visibleRef.value = false);
          return;
        }
        visibleRef.value = false;
      }

      function setDrawerProps(props: Partial<DrawerProps>): void {
        // 保留上一次的setDrawerProps
        propsRef.value = { ...unref(propsRef), ...props };
        if (Reflect.has(props, 'visible')) {
          visibleRef.value = !!props.visible;
        }
      }
      const drawerInstance: DrawerInstance = {
        setDrawerProps,
      };
      emit('get', drawerInstance);

      return () => (
        <Drawer
          placement="right"
          class={prefixCls}
          on={{
            ...listeners,
            close: onClose,
          }}
          props={unref(getProps)}
        >
          <FullLoading absolute v-show={props.loading} tip="加载中..." />
          <template slot="title">
            {props.drawerType === DrawerType.DETAIL ? (
              <Button size="small" type="link" onClick={onClose}>
                <Icon type="left" />
                返回
              </Button>
            ) : (
              <BaseTitle>{unref(getMergeProps).title || getSlot(slots, 'title')}</BaseTitle>
            )}
          </template>
          <ScrollContainer props={unref(getScrollOptions)}>
            {getSlot(slots, 'default')}
          </ScrollContainer>
        </Drawer>
      );
    },
  });
</script>
<style lang="less">
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-drawer';
  @header-padding: 10px;
  @header-height: @header-padding * 2 + 25px;

  .@{prefix-cls} {
    &__detail {
      position: absolute;

      .ant-drawer-header {
        // position: absolute;
        // z-index: 1;
        width: 100%;
        padding: @header-padding;
      }

      .ant-drawer-close {
        height: @header-height;
        line-height: @header-height;
      }

      .ant-drawer-body {
        height: calc(100% - @header-height);
        padding: 0;
        background-color: @background-color-dark;
        // padding-top: @header-height;
      }
    }
  }
</style>
