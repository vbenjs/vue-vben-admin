import './LayoutMultipleHeader.less';

import { defineComponent, unref, computed, ref, watch, nextTick, CSSProperties } from 'vue';

import LayoutHeader from './index.vue';
import MultipleTabs from '../tabs/index.vue';

import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
import { useFullContent } from '/@/hooks/web/useFullContent';
import { useMultipleTabSetting } from '/@/hooks/setting/useMultipleTabSetting';
import { useLayoutContext } from '../useLayoutContext';
import { useAppInject } from '/@/hooks/web/useAppInject';

export default defineComponent({
  name: 'LayoutMultipleHeader',
  setup() {
    const placeholderHeightRef = ref(0);
    const fullHeaderHeightRef = ref(0);
    const headerElRef = ref<ComponentRef>(null);
    const tabElRef = ref<ComponentRef>(null);

    const injectValue = useLayoutContext();

    const { getCalcContentWidth, getSplit } = useMenuSetting();
    const { getIsMobile } = useAppInject();
    const {
      getFixed,
      getShowInsetHeaderRef,
      getShowFullHeaderRef,
      getShowHeader,
      getUnFixedAndFull,
      getHeaderTheme,
    } = useHeaderSetting();

    const { getFullContent } = useFullContent();

    const { getShowMultipleTab } = useMultipleTabSetting();

    const getShowTabs = computed(() => {
      return unref(getShowMultipleTab) && !unref(getFullContent);
    });

    const getPlaceholderDomStyle = computed(
      (): CSSProperties => {
        return {
          height: `${unref(placeholderHeightRef)}px`,
        };
      }
    );

    const getIsShowPlaceholderDom = computed(() => {
      return unref(getFixed) || unref(getShowFullHeaderRef);
    });

    const getWrapStyle = computed(
      (): CSSProperties => {
        const style: CSSProperties = {};
        if (unref(getFixed)) {
          style.width = unref(getIsMobile) ? '100%' : unref(getCalcContentWidth);
        }
        if (unref(getShowFullHeaderRef)) {
          style.top = `${unref(fullHeaderHeightRef)}px`;
        }
        return style;
      }
    );

    const getIsFixed = computed(() => {
      return unref(getFixed) || unref(getShowFullHeaderRef);
    });

    watch(
      () => [
        unref(getFixed),
        unref(getShowFullHeaderRef),
        unref(getShowHeader),
        unref(getShowMultipleTab),
      ],
      () => {
        if (unref(getUnFixedAndFull)) return;
        nextTick(() => {
          const headerEl = unref(headerElRef)?.$el;
          const tabEl = unref(tabElRef)?.$el;
          const fullHeaderEl = unref(injectValue.fullHeader)?.$el;

          let height = 0;
          if (headerEl && !unref(getShowFullHeaderRef) && !unref(getSplit)) {
            height += headerEl.offsetHeight;
          }

          if (tabEl) {
            height += tabEl.offsetHeight;
          }

          if (fullHeaderEl && unref(getShowFullHeaderRef)) {
            const fullHeaderHeight = fullHeaderEl.offsetHeight;
            height += fullHeaderHeight;
            fullHeaderHeightRef.value = fullHeaderHeight;
          }

          placeholderHeightRef.value = height;
        });
      },
      {
        immediate: true,
      }
    );

    return () => {
      return (
        <>
          {unref(getIsShowPlaceholderDom) && <div style={unref(getPlaceholderDomStyle)} />}
          <div
            style={unref(getWrapStyle)}
            class={['multiple-tab-header', unref(getHeaderTheme), { fixed: unref(getIsFixed) }]}
          >
            {unref(getShowInsetHeaderRef) && <LayoutHeader ref={headerElRef} />}
            {unref(getShowTabs) && <MultipleTabs ref={tabElRef} />}
          </div>
        </>
      );
    };
  },
});
