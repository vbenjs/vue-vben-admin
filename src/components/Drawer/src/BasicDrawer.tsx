import './index.less';

import type { DrawerInstance, DrawerProps } from './types';
import type { CSSProperties } from 'vue';

import { defineComponent, ref, computed, watchEffect, watch, unref, nextTick, toRaw } from 'vue';
import { Drawer, Row, Col, Button } from 'ant-design-vue';

import { BasicTitle } from '/@/components/Basic';
import { Loading } from '/@/components/Loading';
import { LeftOutlined } from '@ant-design/icons-vue';

import { useI18n } from '/@/hooks/web/useI18n';

import { getSlot } from '/@/utils/helper/tsxHelper';
import { isFunction, isNumber } from '/@/utils/is';
import { deepMerge } from '/@/utils';
import { tryTsxEmit } from '/@/utils/helper/vueHelper';

import { basicProps } from './props';

const prefixCls = 'basic-drawer';
export default defineComponent({
  inheritAttrs: false,
  props: basicProps,
  emits: ['visible-change', 'ok', 'close', 'register'],
  setup(props, { slots, emit, attrs }) {
    const scrollRef = ref<ElRef>(null);
    const visibleRef = ref(false);
    const propsRef = ref<Partial<Nullable<DrawerProps>>>(null);

    const { t } = useI18n();

    const getMergeProps = computed(
      (): DrawerProps => {
        return deepMerge(toRaw(props), unref(propsRef));
      }
    );

    const getProps = computed(
      (): DrawerProps => {
        const opt = {
          placement: 'right',
          ...attrs,
          ...unref(getMergeProps),
          visible: unref(visibleRef),
        };
        opt.title = undefined;
        const { isDetail, width, wrapClassName, getContainer } = opt;
        if (isDetail) {
          if (!width) {
            opt.width = '100%';
          }
          const detailCls = `${prefixCls}__detail`;

          opt.wrapClassName = wrapClassName ? `${wrapClassName} ${detailCls}` : detailCls;

          if (!getContainer) {
            // TODO type error?
            opt.getContainer = '.layout-content' as any;
          }
        }
        return opt as DrawerProps;
      }
    );

    const getBindValues = computed(
      (): DrawerProps => {
        return {
          ...attrs,
          ...unref(getProps),
        };
      }
    );

    // Custom implementation of the bottom button,
    const getFooterHeight = computed(() => {
      const { footerHeight, showFooter } = unref(getProps);

      if (showFooter && footerHeight) {
        return isNumber(footerHeight) ? `${footerHeight}px` : `${footerHeight.replace('px', '')}px`;
      }
      return `0px`;
    });

    const getScrollContentStyle = computed(
      (): CSSProperties => {
        const footerHeight = unref(getFooterHeight);
        return {
          position: 'relative',
          height: `calc(100% - ${footerHeight})`,
          overflow: 'auto',
          padding: '16px',
          paddingBottom: '30px',
        };
      }
    );

    const getLoading = computed(() => {
      return !!unref(getProps)?.loading;
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

    // Cancel event
    async function onClose(e: ChangeEvent) {
      const { closeFunc } = unref(getProps);
      emit('close', e);
      if (closeFunc && isFunction(closeFunc)) {
        const res = await closeFunc();
        visibleRef.value = !res;
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
      if (slots?.footer) {
        return getSlot(slots, 'footer');
      }
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
      } = unref(getProps);
      if (!showFooter) {
        return null;
      }

      return (
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
      );
    }

    function renderHeader() {
      if (slots?.title) {
        return getSlot(slots, 'title');
      }
      const { title } = unref(getMergeProps);

      if (!props.isDetail) {
        return <BasicTitle>{() => title || getSlot(slots, 'title')}</BasicTitle>;
      }
      return (
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
      );
    }

    const drawerInstance: DrawerInstance = {
      setDrawerProps: setDrawerProps,
    };

    tryTsxEmit((instance) => {
      emit('register', drawerInstance, instance.uid);
    });

    return () => {
      return (
        <Drawer class={prefixCls} onClose={onClose} {...unref(getBindValues)}>
          {{
            title: () => renderHeader(),
            default: () => (
              <>
                <div ref={scrollRef} style={unref(getScrollContentStyle)}>
                  <Loading
                    absolute
                    tip={t('component.drawer.loadingText')}
                    loading={unref(getLoading)}
                  />
                  {getSlot(slots)}
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
