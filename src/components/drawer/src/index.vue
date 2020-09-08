<script lang="tsx">
  import { Drawer, Row, Col } from 'ant-design-vue';
  import {
    defineComponent,
    ref,
    computed,
    watch,
    unref,
    getCurrentInstance,
    nextTick,
  } from 'compatible-vue';
  // import { BaseTitle } from '@/components/base/index';
  import { Icon } from '@/components/icon/index';
  import { BaseTitle } from '@/components/base/index';
  import { ScrollContainer, ScrollContainerOptions } from '@/components/container/index';
  import { FullLoading } from '@/components/loading/index';

  import { getSlot } from '@/utils/helper/tsxHelper';

  import { useDesign } from '@/hooks/core/useDesign';
  import { DrawerInstance, DrawerProps, DrawerType } from './types';

  import { basicProps } from './props';
  import { isFunction, isNumber } from '@/utils/is';
  import { appStore } from '@/store/modules/app';

  export default defineComponent({
    props: basicProps,
    setup(props: DrawerProps, { slots, emit, listeners, root, attrs }) {
      const { prefixCls, prefixVar } = useDesign('drawer');
      const scrollRef = ref<any>(null);

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
      function scrollBottom() {
        const scroll = unref(scrollRef);
        if (scroll) {
          scroll.scrollBottom();
        }
      }
      function scrollTo(to: number) {
        const scroll = unref(scrollRef);
        if (scroll) {
          scroll.scrollTo(to);
        }
      }
      function getScrollWrap() {
        const scroll = unref(scrollRef);
        if (scroll) {
          return scroll.getScrollWrap();
        }
        return null;
      }
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
          // @ts-ignore
          placement: 'right',
          ...attrs,
          ...props,
          ...unref(propsRef),
          visible: unref(visibleRef),
        };
        opt.title = undefined;

        if (opt.drawerType === DrawerType.DETAIL) {
          if (!opt.width) {
            opt.width = '100%';
          }
          opt.wrapClassName = opt.wrapClassName
            ? `${opt.wrapClassName} ${prefixCls}__detail`
            : `${prefixCls}__detail`;
          // opt.maskClosable = false;
          if (!opt.getContainer) {
            opt.getContainer = `.${prefixVar}-default-layout__main`;
          }
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
          appStore.commitLockMainScrollState(visible);
          nextTick(() => {
            emit('visibleChange', visible);
          });
        },
        {
          immediate: false,
        }
      );

      watch(
        () => root.$route,
        () => {
          if (unref(visibleRef)) {
            visibleRef.value = false;
          }
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

      // 底部按钮自定义实现,
      const getFooterHeight = computed(() => {
        const { footerHeight, showFooter }: DrawerProps = unref(getProps);
        if (showFooter && footerHeight) {
          return isNumber(footerHeight)
            ? `${footerHeight}px`
            : `${footerHeight.replace('px', '')}px`;
        }
        return 0;
      });
      function renderFooter() {
        const {
          showCancelBtn,
          cancelButtonProps,
          cancelText,
          showOkBtn,
          okType,
          okText,
          okButtonProps,
          confirmLoading,
          showFooter,
        }: DrawerProps = unref(getProps);

        return (
          getSlot(slots, 'footer') ||
          (showFooter && (
            <div class={`${prefixCls}__footer`}>
              {getSlot(slots, 'insert-footer')}

              {showCancelBtn && (
                <a-button {...{ ...cancelButtonProps }} onClick={onClose} class="mr-2">
                  {cancelText}
                </a-button>
              )}
              {getSlot(slots, 'centerd-footer')}

              {showOkBtn && (
                <a-button
                  type={okType}
                  {...{ ...okButtonProps }}
                  loading={confirmLoading}
                  onClick={() => {
                    emit('ok');
                  }}
                >
                  {okText}
                </a-button>
              )}

              {getSlot(slots, 'append-footer')}
            </div>
          ))
        );
      }

      function renderHeader() {
        const { title } = unref(getMergeProps);
        return (
          <template slot="title">
            {props.drawerType === DrawerType.DETAIL ? (
              getSlot(slots, 'title') || (
                <Row type="flex" align="middle" class={`${prefixCls}__detail-header`}>
                  {props.showDetailBack && (
                    <Col class="mx-2">
                      <a-button size="small" type="link" onClick={onClose}>
                        <Icon type="left" />
                        返回
                      </a-button>
                    </Col>
                  )}
                  {title && (
                    <Col style="flex:1" class={[`${prefixCls}__detail-title`, 'ellipsis', 'px-2']}>
                      {title}
                    </Col>
                  )}
                  {getSlot(slots, 'title-toolbar')}
                </Row>
              )
            ) : (
              <BaseTitle>{title || getSlot(slots, 'title')}</BaseTitle>
            )}
          </template>
        );
      }

      const currentInstace = getCurrentInstance() as any;
      if (getCurrentInstance()) {
        currentInstace.scrollBottom = scrollBottom;
        currentInstace.scrollTo = scrollTo;
        currentInstace.getScrollWrap = getScrollWrap;
      }
      const drawerInstance: DrawerInstance = {
        setDrawerProps,
      };
      emit('register', drawerInstance);

      return () => (
        <Drawer
          class={prefixCls}
          {...{
            on: {
              ...listeners,
              close: onClose,
            },
            props: unref(getProps),
          }}
        >
          <FullLoading absolute v-show={props.loading} tip="加载中..." />
          {renderHeader()}
          <ScrollContainer
            ref={scrollRef}
            props={unref(getScrollOptions)}
            on={listeners}
            style={{
              height: `calc(100% - ${unref(getFooterHeight)})`,
            }}
          >
            {getSlot(slots, 'default')}
          </ScrollContainer>
          {renderFooter()}
        </Drawer>
      );
    },
  });
</script>
<style lang="less">
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-drawer';
  // @header-padding: 10px;
  @header-height: 50px;
  @footer-height: 60px;

  .@{prefix-cls} {
    .ant-drawer-wrapper-body {
      overflow: hidden;
    }

    .ant-drawer-body {
      height: calc(100% - @header-height);
      padding: 0;
      background-color: @background-color-dark;
      // padding-top: @header-height;
      .scrollbar__wrap {
        padding: 16px;
      }
    }

    &__detail {
      position: absolute;

      &-header {
        height: 100%;
      }

      .ant-drawer-header {
        // position: absolute;
        // z-index: 1;

        width: 100%;
        height: @header-height;
        padding: 0;
        border-top: 1px solid @border-color-base;
        box-sizing: border-box;
      }

      .ant-drawer-title {
        height: 100%;
      }

      .ant-drawer-close {
        height: @header-height;
        line-height: @header-height;
      }

      .scrollbar__wrap {
        padding: 0;
      }
    }

    &__footer {
      // position: absolute;
      height: @footer-height;
      padding: 0 26px;
      line-height: @footer-height;
      text-align: right;
      background: #fff;
      border-top: 1px solid @border-color-base;
    }
  }
</style>
