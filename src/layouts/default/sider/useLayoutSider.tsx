import type { Ref } from 'vue';

import { computed, unref, onMounted, nextTick, ref } from 'vue';
import LayoutTrigger from '/@/layouts/default/LayoutTrigger';

import { TriggerEnum } from '/@/enums/menuEnum';

import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
import { useDebounce } from '/@/hooks/core/useDebounce';

/**
 * Handle related operations of menu events
 */
export function useSiderEvent() {
  const initRef = ref(false);
  const brokenRef = ref(false);
  const collapseRef = ref(true);

  const { setMenuSetting, getCollapsed, getMiniWidthNumber, getShowMenu } = useMenuSetting();

  const getCollapsedWidth = computed(() => {
    return unref(brokenRef) ? 0 : unref(getMiniWidthNumber);
  });

  function onCollapseChange(val: boolean) {
    if (initRef.value) {
      collapseRef.value = val;
      setMenuSetting({ collapsed: val });
    } else {
      !unref(getCollapsed) && setMenuSetting({ collapsed: val });
    }
    initRef.value = true;
  }

  function onBreakpointChange(broken: boolean) {
    brokenRef.value = broken;
  }

  function onSiderClick(e: ChangeEvent) {
    if (!e || !e.target || e.target.className !== 'basic-menu__content') return;
    if (!unref(getCollapsed) || !unref(getShowMenu)) return;
    setMenuSetting({ collapsed: false });
  }
  return { getCollapsedWidth, onCollapseChange, onBreakpointChange, onSiderClick };
}

/**
 * Handle related operations of menu folding
 */
export function useTrigger() {
  const { getTrigger } = useMenuSetting();

  const showTrigger = computed(() => {
    const trigger = unref(getTrigger);
    return trigger !== TriggerEnum.NONE && trigger === TriggerEnum.FOOTER;
  });

  const getTriggerAttr = computed(() => {
    if (unref(showTrigger)) {
      return {};
    }
    return {
      trigger: null,
    };
  });

  const getTriggerSlot = computed(() => {
    if (unref(showTrigger)) {
      return {
        trigger: () => <LayoutTrigger />,
      };
    }
    return {};
  });

  return { getTriggerAttr, getTriggerSlot };
}

/**
 * Handle menu drag and drop related operations
 * @param siderRef
 * @param dragBarRef
 */
export function useDragLine(siderRef: Ref<any>, dragBarRef: Ref<any>) {
  const { getMiniWidthNumber, getCollapsed, setMenuSetting, getCanDrag } = useMenuSetting();

  const getDragBarStyle = computed(() => {
    if (unref(getCollapsed)) {
      return { left: `${unref(getMiniWidthNumber)}px` };
    }
    return {};
  });

  onMounted(() => {
    nextTick(() => {
      const [exec] = useDebounce(changeWrapWidth, 20);
      exec();
    });
  });

  function renderDragLine() {
    return (
      <div
        class={[`layout-sidebar__darg-bar`, { hide: !unref(getCanDrag) }]}
        style={unref(getDragBarStyle)}
        ref={dragBarRef}
      />
    );
  }

  function handleMouseMove(ele: HTMLElement, wrap: HTMLElement, clientX: number) {
    document.onmousemove = function (innerE) {
      let iT = (ele as any).left + (innerE.clientX - clientX);
      innerE = innerE || window.event;
      const maxT = 600;
      const minT = unref(getMiniWidthNumber);
      iT < 0 && (iT = 0);
      iT > maxT && (iT = maxT);
      iT < minT && (iT = minT);
      ele.style.left = wrap.style.width = iT + 'px';
      return false;
    };
  }

  // Drag and drop in the menu area-release the mouse
  function removeMouseup(ele: any) {
    const wrap = unref(siderRef).$el;
    document.onmouseup = function () {
      document.onmousemove = null;
      document.onmouseup = null;
      const width = parseInt(wrap.style.width);
      const miniWidth = unref(getMiniWidthNumber);

      if (!unref(getCollapsed)) {
        width > miniWidth + 20
          ? setMenuSetting({ menuWidth: width })
          : setMenuSetting({ collapsed: true });
      } else {
        width > miniWidth && setMenuSetting({ collapsed: false, menuWidth: width });
      }
      ele.releaseCapture?.();
    };
  }

  function changeWrapWidth() {
    const ele = unref(dragBarRef) as any;
    const side = unref(siderRef);

    const wrap = (side || {}).$el;
    ele &&
      (ele.onmousedown = (e: any) => {
        wrap.style.transition = 'unset';
        const clientX = e?.clientX;
        ele.left = ele.offsetLeft;
        handleMouseMove(ele, wrap, clientX);
        removeMouseup(ele);
        ele.setCapture?.();
        return false;
      });
  }

  return { renderDragLine };
}
