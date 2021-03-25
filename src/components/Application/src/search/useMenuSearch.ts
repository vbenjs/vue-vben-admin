import type { Menu } from '/@/router/types';

import { ref, onBeforeMount, unref, Ref, nextTick } from 'vue';

import { getMenus } from '/@/router/menus';
import { KeyCodeEnum } from '/@/enums/keyCodeEnum';

import { cloneDeep } from 'lodash-es';
import { filter, forEach } from '/@/utils/helper/treeHelper';

import { useDebounce } from '/@/hooks/core/useDebounce';
import { useGo } from '/@/hooks/web/usePage';
import { useScrollTo } from '/@/hooks/event/useScrollTo';
import { useKeyPress } from '/@/hooks/event/useKeyPress';
import { useI18n } from '/@/hooks/web/useI18n';

export interface SearchResult {
  name: string;
  path: string;
  icon?: string;
}

// Translate special characters
function transform(c: string) {
  const code: string[] = ['$', '(', ')', '*', '+', '.', '[', ']', '?', '\\', '^', '{', '}', '|'];
  return code.includes(c) ? `\\${c}` : c;
}

function createSearchReg(key: string) {
  const keys = [...key].map((item) => transform(item));
  const str = ['', ...keys, ''].join('.*');
  return new RegExp(str);
}

export function useMenuSearch(refs: Ref<HTMLElement[]>, scrollWrap: Ref<ElRef>, emit: EmitType) {
  const searchResult = ref<SearchResult[]>([]);
  const keyword = ref('');
  const activeIndex = ref(-1);

  let menuList: Menu[] = [];

  const { t } = useI18n();
  const go = useGo();
  const [handleSearch] = useDebounce(search, 200);

  onBeforeMount(async () => {
    const list = await getMenus();
    menuList = cloneDeep(list);
    forEach(menuList, (item) => {
      item.name = t(item.name);
    });
  });

  function search(e: ChangeEvent) {
    e?.stopPropagation();
    const key = e.target.value;
    keyword.value = key.trim();
    if (!key) {
      searchResult.value = [];
      return;
    }
    const reg = createSearchReg(unref(keyword));
    const filterMenu = filter(menuList, (item) => {
      return reg.test(item.name);
    });
    searchResult.value = handlerSearchResult(filterMenu, reg);
    activeIndex.value = 0;
  }

  function handlerSearchResult(filterMenu: Menu[], reg: RegExp, parent?: Menu) {
    const ret: SearchResult[] = [];

    filterMenu.forEach((item) => {
      const { name, path, icon, children } = item;
      if (reg.test(name) && !children?.length) {
        ret.push({
          name: parent?.name ? `${parent.name} > ${name}` : name,
          path,
          icon,
        });
      }
      if (Array.isArray(children) && children.length) {
        ret.push(...handlerSearchResult(children, reg, item));
      }
    });
    return ret;
  }

  function handleMouseenter(e: any) {
    const index = e.target.dataset.index;
    activeIndex.value = Number(index);
  }

  function handleUp() {
    if (!searchResult.value.length) return;
    activeIndex.value--;
    if (activeIndex.value < 0) {
      activeIndex.value = searchResult.value.length - 1;
    }
    handleScroll();
  }

  function handleDown() {
    if (!searchResult.value.length) return;
    activeIndex.value++;
    if (activeIndex.value > searchResult.value.length - 1) {
      activeIndex.value = 0;
    }
    handleScroll();
  }

  function handleScroll() {
    const refList = unref(refs);
    if (!refList || !Array.isArray(refList) || refList.length === 0 || !unref(scrollWrap)) return;

    const index = unref(activeIndex);
    const currentRef = refList[index];
    if (!currentRef) return;
    const wrapEl = unref(scrollWrap);
    if (!wrapEl) return;
    const scrollHeight = currentRef.offsetTop + currentRef.offsetHeight;
    const wrapHeight = wrapEl.offsetHeight;
    const { start } = useScrollTo({
      el: wrapEl,
      duration: 100,
      to: scrollHeight - wrapHeight,
    });
    start();
  }

  async function handleEnter() {
    if (!searchResult.value.length) return;
    const result = unref(searchResult);
    const index = unref(activeIndex);
    if (result.length === 0 || index < 0) {
      return;
    }
    const to = result[index];
    handleClose();
    await nextTick();
    go(to.path);
  }

  function handleClose() {
    searchResult.value = [];
    emit('close');
  }

  useKeyPress(['enter', 'up', 'down', 'esc'], (events) => {
    const keyCode = events.keyCode;
    switch (keyCode) {
      case KeyCodeEnum.UP:
        handleUp();
        break;
      case KeyCodeEnum.DOWN:
        handleDown();
        break;
      case KeyCodeEnum.ENTER:
        handleEnter();
        break;
      case KeyCodeEnum.ESC:
        handleClose();
        break;
    }
  });

  return { handleSearch, searchResult, keyword, activeIndex, handleMouseenter, handleEnter };
}
