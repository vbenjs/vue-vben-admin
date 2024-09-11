import { useI18n } from '@/hooks/web/useI18n';
import { useGo } from '@/hooks/web/usePage';
import { getMenus } from '@/router/menus';
import { type Menu } from '@/router/types';
import { filter, forEach } from '@/utils/helper/treeHelper';
import { useScrollTo } from '@vben/hooks';
import { type AnyFunction } from '@vben/types';
import { onKeyStroke, useDebounceFn } from '@vueuse/core';
import { cloneDeep } from 'lodash-es';
import { Ref, nextTick, onBeforeMount, ref, unref } from 'vue';

export interface SearchResult {
  name: string;
  path: string;
  icon?: string;
  // 搜索结果包含的字符着色
  chars: { char: string; highlight: boolean }[];
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

export function useMenuSearch(refs: Ref<HTMLElement[]>, scrollWrap: Ref, emit: AnyFunction) {
  const searchResult = ref<SearchResult[]>([]);
  const keyword = ref('');
  const activeIndex = ref(-1);

  let menuList: Menu[] = [];

  const { t } = useI18n();
  const go = useGo();
  const handleSearch = useDebounceFn(search, 200);

  onBeforeMount(async () => {
    const list = await getMenus();
    menuList = cloneDeep(list);
    forEach(menuList, (item) => {
      item.name = t(item.meta?.title || item.name);
    });
  });

  function search(e: ChangeEvent) {
    e?.stopPropagation();
    const key = e.target.value;
    keyword.value = key.trim().toLowerCase();
    if (!key) {
      searchResult.value = [];
      return;
    }
    const reg = createSearchReg(unref(keyword));
    const filterMenu = filter(menuList, (item) => {
      return reg.test(item.name?.toLowerCase()) && !item.hideMenu;
    });
    searchResult.value = handlerSearchResult(filterMenu, reg);
    activeIndex.value = 0;
  }

  function handlerSearchResult(filterMenu: Menu[], reg: RegExp, parent?: Menu) {
    const ret: SearchResult[] = [];
    filterMenu.forEach((item) => {
      const { name, path, icon, children, hideMenu, meta } = item;
      if (
        !hideMenu &&
        reg.test(name?.toLowerCase() ?? '') &&
        (!children?.length || meta?.hideChildrenInMenu)
      ) {
        const chars: { char: string; highlight: boolean }[] = [];

        // 显示字符串
        const label = (parent?.name ? `${parent.name} > ${name}` : name) ?? '';
        const labelChars = label.split('');
        let labelPointer = 0;

        const keywordChars = keyword.value.split('');
        const keywordLength = keywordChars.length;
        let keywordPointer = 0;

        // 用于查找完整关键词的匹配
        let includePointer = 0;

        // 优先查找完整关键词的匹配
        if (label.toLowerCase().includes(keyword.value.toLowerCase())) {
          while (includePointer < labelChars.length) {
            if (
              label.toLowerCase().slice(includePointer, includePointer + keywordLength) ===
              keyword.value.toLowerCase()
            ) {
              chars.push(
                ...label
                  .substring(labelPointer, includePointer)
                  .split('')
                  .map((v) => ({
                    char: v,
                    highlight: false,
                  })),
              );
              chars.push(
                ...label
                  .slice(includePointer, includePointer + keywordLength)
                  .split('')
                  .map((v) => ({
                    char: v,
                    highlight: true,
                  })),
              );
              includePointer += keywordLength;
              labelPointer = includePointer;
            } else {
              includePointer++;
            }
          }
        }

        // 查找满足关键词顺序的匹配
        while (labelPointer < labelChars.length) {
          keywordPointer = 0;
          while (keywordPointer < keywordChars.length) {
            if (keywordChars[keywordPointer] !== void 0 && labelChars[labelPointer] !== void 0) {
              if (
                keywordChars[keywordPointer].toLowerCase() ===
                labelChars[labelPointer].toLowerCase()
              ) {
                chars.push({
                  char: labelChars[labelPointer],
                  highlight: true,
                });
                keywordPointer++;
              } else {
                chars.push({
                  char: labelChars[labelPointer],
                  highlight: false,
                });
              }
            } else {
              keywordPointer++;
            }
            labelPointer++;
          }
        }
        ret.push({
          name: label,
          chars,
          path,
          icon,
        });
      }
      if (!meta?.hideChildrenInMenu && Array.isArray(children) && children.length) {
        ret.push(...handlerSearchResult(children, reg, item));
      }
    });

    // 排序
    return ret.sort((a, b) => {
      if (
        a.name.toLowerCase().includes(keyword.value.toLowerCase()) &&
        b.name.toLowerCase().includes(keyword.value.toLowerCase())
      ) {
        // 两者都存在完整关键词的匹配

        // 匹配数量
        const ca =
          a.name.toLowerCase().match(new RegExp(keyword.value.toLowerCase(), 'g'))?.length ?? 0;
        const cb =
          b.name.toLowerCase().match(new RegExp(keyword.value.toLowerCase(), 'g'))?.length ?? 0;

        // 匹配数量越多的优先显示，数量相同的按字符串排序
        return ca === cb ? a.name.toLowerCase().localeCompare(b.name.toLowerCase()) : cb - ca;
      } else {
        if (a.name.toLowerCase().includes(keyword.value.toLowerCase())) {
          // 完整关键词的匹配优先
          return -1;
        } else if (b.name.toLowerCase().includes(keyword.value.toLowerCase())) {
          // 完整关键词的匹配优先
          return 1;
        } else {
          // 按字符串排序
          return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
        }
      }
    });
  }

  // Activate when the mouse moves to a certain line
  function handleMouseenter(e: any) {
    const index = e.target.dataset.index;
    activeIndex.value = Number(index);
  }

  // Arrow key up
  function handleUp() {
    if (!searchResult.value.length) return;
    activeIndex.value--;
    if (activeIndex.value < 0) {
      activeIndex.value = searchResult.value.length - 1;
    }
    handleScroll();
  }

  // Arrow key down
  function handleDown() {
    if (!searchResult.value.length) return;
    activeIndex.value++;
    if (activeIndex.value > searchResult.value.length - 1) {
      activeIndex.value = 0;
    }
    handleScroll();
  }

  // When the keyboard up and down keys move to an invisible place
  // the scroll bar needs to scroll automatically
  function handleScroll() {
    const refList = unref(refs);
    if (!refList || !Array.isArray(refList) || refList.length === 0 || !unref(scrollWrap)) {
      return;
    }

    const index = unref(activeIndex);
    const currentRef = refList[index];
    if (!currentRef) {
      return;
    }
    const wrapEl = unref(scrollWrap);
    if (!wrapEl) {
      return;
    }
    const scrollHeight = currentRef.offsetTop + currentRef.offsetHeight;
    const wrapHeight = wrapEl.offsetHeight;
    const { start } = useScrollTo({
      el: wrapEl,
      duration: 100,
      to: scrollHeight - wrapHeight,
    });
    start();
  }

  // enter keyboard event
  async function handleEnter() {
    if (!searchResult.value.length) {
      return;
    }
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

  // close search modal
  function handleClose() {
    searchResult.value = [];
    emit('close');
  }

  // enter search
  onKeyStroke('Enter', handleEnter);
  // Monitor keyboard arrow keys
  onKeyStroke('ArrowUp', handleUp);
  onKeyStroke('ArrowDown', handleDown);
  // esc close
  onKeyStroke('Escape', handleClose);

  return { handleSearch, searchResult, keyword, activeIndex, handleMouseenter, handleEnter };
}
