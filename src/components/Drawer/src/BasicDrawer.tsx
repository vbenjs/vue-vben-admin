import type { DrawerInstance, DrawerProps } from './types';

import { defineComponent, ref, computed, watchEffect, watch, unref, nextTick, toRaw } from 'vue';
import { Drawer, Row, Col, Button } from 'ant-design-vue';

import { BasicTitle } from '/@/components/Basic';
import { FullLoading } from '/@/components/Loading/index';
import { LeftOutlined } from '@ant-design/icons-vue';

import { basicProps } from './props';

import { getSlot } from '/@/utils/helper/tsxHelper';
import { isFunction, isNumber } from '/@/utils/is';
import { buildUUID } from '/@/utils/uuid';
import { deepMerge } from '/@/utils';

import './index.less';

const prefixCls = 'basic-drawer';
export default defineComponent({
  // inheritAttrs: false,
  props: basicProps,
  emits: ['visible-change', 'ok', 'close', 'register'],
  setup(props, { slots, emit, attrs }) {
    const scrollRef = ref<any>(null);

    const visibleRef = ref(false);
    const propsRef = ref<Partial<DrawerProps> | null>(null);

    const getMergeProps = computed((): any => {
      return deepMerge(toRaw(props), unref(propsRef));
    });

    const getProps = computed(() => {
      const opt: any = {
        placement: 'right',
        ...attrs,
        ...props,
        ...(unref(propsRef) as any),
        visible: unref(visibleRef),
      };
      opt.title = undefined;

      if (opt.isDetail) {
        if (!opt.width) {
          opt.width = '100%';
        }
        opt.wrapClassName = opt.wrapClassName
          ? `${opt.wrapClassName} ${prefixCls}__detail`
          : `${prefixCls}__detail`;
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
        nextTick(() => {
          emit('visible-change', visible);
        });
      },
      {
        immediate: false,
      }
    );

    // Custom implementation of the bottom button,
    const getFooterHeight = computed(() => {
      const { footerHeight, showFooter }: DrawerProps = unref(getProps);
      if (showFooter && footerHeight) {
        return isNumber(footerHeight) ? `${footerHeight}px` : `${footerHeight.replace('px', '')}px`;
      }
      return `0px`;
    });

    // Cancel event
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
      // Keep the last setDrawerProps
      propsRef.value = deepMerge(unref(propsRef) || {}, props);
      if (Reflect.has(props, 'visible')) {
        visibleRef.value = !!props.visible;
      }
    }

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
                onClick={() => {
                  emit('ok');
                }}
                {...okButtonProps}
                loading={confirmLoading}
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
      return props.isDetail ? (
        getSlot(slots, 'title') || (
          <Row type="flex" align="middle" class={`${prefixCls}__detail-header`}>
            {() => (
              <>
                {props.showDetailBack && (
                  <Button size="small" type="link" onClick={onClose}>
                    {() => <LeftOutlined />}
                  </Button>
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
                <div
                  ref={scrollRef}
                  {...attrs}
                  style={{
                    position: 'relative',
                    height: `calc(100% - ${footerHeight})`,
                    overflow: 'auto',
                    padding: '16px',
                    paddingBottom: '30px',
                  }}
                >
                  <FullLoading
                    absolute
                    tip="加载中..."
                    class={[!unref(getProps).loading ? 'hidden' : '']}
                  />
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
