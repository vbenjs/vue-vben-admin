import { Drawer, Row, Col, Button } from 'ant-design-vue';
import {
  defineComponent,
  ref,
  computed,
  watchEffect,
  watch,
  unref,
  // getCurrentInstance,
  nextTick,
  toRaw,
} from 'vue';
import { BasicTitle } from '/@/components/Basic';
// import { ScrollContainer, ScrollContainerOptions } from '/@/components/Container/index';
import { FullLoading } from '/@/components/Loading/index';

import { getSlot } from '/@/utils/helper/tsxHelper';

import { DrawerInstance, DrawerProps, DrawerType } from './types';

import { basicProps } from './props';
import { isFunction, isNumber } from '/@/utils/is';
import { LeftOutlined } from '@ant-design/icons-vue';
// import { appStore } from '/@/store/modules/app';
// import { useRouter } from 'vue-router';
import { buildUUID } from '/@/utils/uuid';
import { deepMerge } from '/@/utils';
import './index.less';

const prefixCls = 'basic-drawer';
export default defineComponent({
  // inheritAttrs: false,
  props: basicProps,
  emits: ['visible-change', 'ok', 'close', 'register'],
  setup(props, { slots, emit, attrs }) {
    // const { currentRoute } = useRouter();
    const scrollRef = ref<any>(null);
    // /**
    //  * @description: 获取配置ScrollContainer
    //  */
    // const getScrollOptions = computed(
    //   (): ScrollContainerOptions => {
    //     return {
    //       ...(props.scrollOptions as any),
    //     };
    //   }
    // );

    const visibleRef = ref(false);
    const propsRef = ref<Partial<DrawerProps> | null>(null);

    // 自定义title组件：获得title
    const getMergeProps = computed((): any => {
      return deepMerge(toRaw(props), unref(propsRef));
    });

    const getProps = computed(() => {
      const opt: any = {
        // @ts-ignore
        placement: 'right',
        ...attrs,
        ...props,
        ...(unref(propsRef) as any),
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
          opt.getContainer = `.default-layout__main`;
        }
      }
      return opt;
    });
    watchEffect(() => {
      visibleRef.value = props.visible;
    });
    watch(
      () => visibleRef.value,
      (visible) => {
        // appStore.commitLockMainScrollState(visible);
        nextTick(() => {
          emit('visible-change', visible);
        });
      },
      {
        immediate: false,
      }
    );

    // function scrollBottom() {
    //   const scroll = unref(scrollRef);
    //   if (scroll) {
    //     scroll.scrollBottom();
    //   }
    // }

    // function scrollTo(to: number) {
    //   const scroll = unref(scrollRef);
    //   if (scroll) {
    //     scroll.scrollTo(to);
    //   }
    // }

    // function getScrollWrap() {
    //   const scroll = unref(scrollRef);
    //   if (scroll) {
    //     return scroll.getScrollWrap();
    //   }
    //   return null;
    // }
    // 取消事件
    async function onClose(e: any) {
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
      propsRef.value = deepMerge(unref(propsRef) || {}, props);
      if (Reflect.has(props, 'visible')) {
        visibleRef.value = !!props.visible;
      }
    }

    // 底部按钮自定义实现,
    const getFooterHeight = computed(() => {
      const { footerHeight, showFooter }: DrawerProps = unref(getProps);
      if (showFooter && footerHeight) {
        return isNumber(footerHeight) ? `${footerHeight}px` : `${footerHeight.replace('px', '')}px`;
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
            {getSlot(slots, 'insertFooter')}

            {showCancelBtn && (
              <Button {...cancelButtonProps} onClick={onClose} class="mr-2">
                {() => cancelText}
              </Button>
            )}
            {getSlot(slots, 'centerFooter')}
            {showOkBtn && (
              <Button
                type={okType}
                {...okButtonProps}
                loading={confirmLoading}
                onClick={() => {
                  emit('ok');
                }}
              >
                {() => okText}
              </Button>
            )}

            {getSlot(slots, 'appendFooter')}
          </div>
        ))
      );
    }

    function renderHeader() {
      const { title } = unref(getMergeProps);
      return props.drawerType === DrawerType.DETAIL ? (
        getSlot(slots, 'title') || (
          <Row type="flex" align="middle" class={`${prefixCls}__detail-header`}>
            {() => (
              <>
                {props.showDetailBack && (
                  <Col class="mx-2">
                    {() => (
                      <Button size="small" type="link" onClick={onClose}>
                        {() => <LeftOutlined />}
                      </Button>
                    )}
                  </Col>
                )}
                {title && (
                  <Col style="flex:1" class={[`${prefixCls}__detail-title`, 'ellipsis', 'px-2']}>
                    {() => title}
                  </Col>
                )}
                {getSlot(slots, 'titleToolbar')}
              </>
            )}
          </Row>
        )
      ) : (
        <BasicTitle>{() => title || getSlot(slots, 'title')}</BasicTitle>
      );
    }

    // const currentInstance = getCurrentInstance() as any;
    // if (getCurrentInstance()) {
    //   currentInstance.scrollBottom = scrollBottom;
    //   currentInstance.scrollTo = scrollTo;
    //   currentInstance.getScrollWrap = getScrollWrap;
    // }
    const drawerInstance: DrawerInstance = {
      setDrawerProps: setDrawerProps,
    };

    const uuid = buildUUID();
    emit('register', drawerInstance, uuid);

    return () => {
      const footerHeight = unref(getFooterHeight);

      return (
        <Drawer
          class={prefixCls}
          onClose={onClose}
          {...{
            ...attrs,
            ...unref(getProps),
          }}
        >
          {{
            title: () => renderHeader(),
            default: () => (
              <>
                <FullLoading
                  absolute
                  class={[!unref(getProps).loading ? 'hidden' : '']}
                  tip="加载中..."
                />
                {/* <ScrollContainer
                  ref={scrollRef}
                  {...{ ...attrs, ...unref(getScrollOptions) }}
                  style={{
                    height: `calc(100% - ${footerHeight})`,
                  }}
                >
                  {() => getSlot(slots, 'default')}
                </ScrollContainer> */}
                <div
                  ref={scrollRef}
                  {...attrs}
                  style={{
                    height: `calc(100% - ${footerHeight}px)`,
                    overflow: 'auto',
                    padding: '16px',
                    paddingBottom: '30px',
                  }}
                >
                  {getSlot(slots, 'default')}
                </div>
                {renderFooter()}
              </>
            ),
          }}
        </Drawer>
      );
    };
  },
});
