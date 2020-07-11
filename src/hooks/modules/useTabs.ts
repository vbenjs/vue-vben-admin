type Fn = () => void;
let refreshPage: Fn;
let closeAll: Fn;
let closeLeft: Fn;
let closeRight: Fn;
let closeOther: Fn;
let closeCurrent: Fn;

interface TabFn {
  refreshPageFn: Fn;
  closeAllFn: Fn;
  closeLeftFn: Fn;
  closeRightFn: Fn;
  closeOtherFn: Fn;
  closeCurrentFn: Fn;
}

export function useTabs() {
  function initTabFn({
    refreshPageFn,
    closeAllFn,
    closeLeftFn,
    closeRightFn,
    closeOtherFn,
    closeCurrentFn,
  }: TabFn) {
    refreshPageFn && (refreshPage = refreshPageFn);
    closeAllFn && (closeAll = closeAllFn);
    closeLeftFn && (closeLeft = closeLeftFn);
    closeRightFn && (closeRight = closeRightFn);
    closeOtherFn && (closeOther = closeOtherFn);
    closeCurrentFn && (closeCurrent = closeCurrentFn);
  }

  function resetCache() {
    const def = undefined as any;
    refreshPage = def;
    closeAll = def;
    closeLeft = def;
    closeRight = def;
    closeOther = def;
    closeCurrent = def;
  }
  return {
    initTabFn,
    refreshPage: () => refreshPage(),
    closeAll: () => closeAll(),
    closeLeft: () => closeLeft(),
    closeRight: () => closeRight(),
    closeOther: () => closeOther(),
    closeCurrent: () => closeCurrent(),
    resetCache: () => resetCache(),
  };
}
