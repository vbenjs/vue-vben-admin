import { ComputedRef, nextTick, Ref, ref, unref } from 'vue';
import { WrapperProps } from './types';
import { onMountedOrActivated } from '/@/hooks/core/onMountedOrActivated';
import { useWindowSizeFn } from '/@/hooks/event/useWindowSizeFn';
import { getViewportOffset } from '/@/utils/domUtils';

export function useContentHeight(
  propsRef: ComputedRef<WrapperProps>,
  wrapperRef: Ref<ElRef>,
  headerRef?: Ref<ComponentRef>,
  contentRef?: Ref<ElRef>,
  footerRef?: Ref<ComponentRef>,
  layoutFooterHeightRef: Ref<number> = ref(0),
  offsetHeightRef: Ref<number> = ref(0)
) {
  const contentHeight: Ref<Nullable<number>> = ref(null);

  const redoHeight = () => {
    nextTick(() => {
      calcContentHeight();
    });
  };

  const subtractMargin = (element: HTMLElement | null | undefined): number => {
    let subtractHeight = 0;
    const ZERO_PX = '0px';
    let marginBottom = ZERO_PX;
    let marginTop = ZERO_PX;
    if (element) {
      const cssStyle = getComputedStyle(element);
      marginBottom = cssStyle?.marginBottom ?? ZERO_PX;
      marginTop = cssStyle?.marginTop ?? ZERO_PX;
    }
    if (marginBottom) {
      const contentMarginBottom = Number(marginBottom.replace(/[^\d]/g, ''));
      subtractHeight += contentMarginBottom;
    }
    if (marginTop) {
      const contentMarginTop = Number(marginTop.replace(/[^\d]/g, ''));
      subtractHeight += contentMarginTop;
    }
    return subtractHeight;
  };

  const calcContentHeight = async () => {
    const { contentFullHeight } = unref(propsRef);
    if (!contentFullHeight) {
      return;
    }
    // Add a delay to get the correct height
    await nextTick();

    const wrapperEl = unref(wrapperRef);
    if (!wrapperEl) {
      return;
    }
    const { bottomIncludeBody } = getViewportOffset(wrapperEl);
    const headerHeight = unref(headerRef)?.$el.offsetHeight ?? 0;
    const footerHeight = unref(footerRef)?.$el.offsetHeight ?? 0;

    // content's subtract
    const substractHeight = subtractMargin(unref(contentRef));
    let height =
      bottomIncludeBody -
      unref(layoutFooterHeightRef) -
      unref(offsetHeightRef) -
      headerHeight -
      footerHeight -
      substractHeight;

    // fix: compensation height both layout's footer and page's footer was shown
    if (unref(layoutFooterHeightRef) > 0 && footerHeight > 0) {
      height += footerHeight;
    }

    contentHeight.value = height;
  };

  onMountedOrActivated(() => {
    nextTick(() => {
      calcContentHeight();
    });
  });
  useWindowSizeFn(
    () => {
      calcContentHeight();
    },
    50,
    { immediate: true }
  );

  return { redoHeight, contentHeight };
}
