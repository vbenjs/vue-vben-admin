<script lang="ts" setup>
import type {
  MenuItemClicked,
  MenuItemRegistered,
  MenuProps,
  MenuProvider,
} from '../interface';

import {
  type VNodeArrayChildren,
  computed,
  nextTick,
  reactive,
  ref,
  toRef,
  useSlots,
  watch,
  watchEffect,
} from 'vue';

import { IcRoundMoreHoriz } from '@vben-core/iconify';
import { isHttpUrl, useNamespace } from '@vben-core/toolkit';

import { UseResizeObserverReturn, useResizeObserver } from '@vueuse/core';

import {
  createMenuContext,
  createSubMenuContext,
  useMenuStyle,
} from '../hooks';
import { flattedChildren } from '../utils';
import SubMenu from './sub-menu.vue';

interface Props extends MenuProps {}

defineOptions({ name: 'Menu' });

const props = withDefaults(defineProps<Props>(), {
  accordion: true,
  collapse: false,
  mode: 'vertical',
  rounded: true,
  theme: 'dark',
});

const emit = defineEmits<{
  close: [string, string[]];
  open: [string, string[]];
  select: [string, string[]];
}>();

const { b, is } = useNamespace('menu');
const menuStyle = useMenuStyle();
const slots = useSlots();
const menu = ref<HTMLUListElement>();
const sliceIndex = ref(-1);
const openedMenus = ref<MenuProvider['openedMenus']>(
  props.defaultOpeneds && !props.collapse ? [...props.defaultOpeneds] : [],
);
const activePath = ref<MenuProvider['activePath']>(props.defaultActive);
const items = ref<MenuProvider['items']>({});
const subMenus = ref<MenuProvider['subMenus']>({});
const mouseInChild = ref(false);
const defaultSlots: VNodeArrayChildren = slots.default?.() ?? [];

const isMenuPopup = computed<MenuProvider['isMenuPopup']>(() => {
  return (
    props.mode === 'horizontal' || (props.mode === 'vertical' && props.collapse)
  );
});

const getSlot = computed(() => {
  const originalSlot = flattedChildren(defaultSlots) as VNodeArrayChildren;
  const slotDefault =
    sliceIndex.value === -1
      ? originalSlot
      : originalSlot.slice(0, sliceIndex.value);

  const slotMore =
    sliceIndex.value === -1 ? [] : originalSlot.slice(sliceIndex.value);

  return { showSlotMore: slotMore.length > 0, slotDefault, slotMore };
});

watch(
  () => props.collapse,
  (value) => {
    if (value) openedMenus.value = [];
  },
);

watch(items.value, initMenu);

watch(
  () => props.defaultActive,
  (currentActive = '') => {
    if (!items.value[currentActive]) {
      activePath.value = '';
    }
    updateActiveName(currentActive);
  },
);

let resizeStopper: UseResizeObserverReturn['stop'];
watchEffect(() => {
  if (props.mode === 'horizontal') {
    resizeStopper = useResizeObserver(menu, handleResize).stop;
  } else {
    resizeStopper?.();
  }
});

// 注入上下文
createMenuContext(
  reactive({
    activePath,
    addMenuItem,
    addSubMenu,
    closeMenu,
    handleMenuItemClick,
    handleSubMenuClick,
    isMenuPopup,
    openMenu,
    openedMenus,
    props,
    removeMenuItem,
    removeSubMenu,
    subMenus,
    theme: toRef(props, 'theme'),
    items,
  }),
);

createSubMenuContext({
  addSubMenu,
  level: 1,
  mouseInChild,
  removeSubMenu,
});

function calcMenuItemWidth(menuItem: HTMLElement) {
  const computedStyle = getComputedStyle(menuItem);
  const marginLeft = Number.parseInt(computedStyle.marginLeft, 10);
  const marginRight = Number.parseInt(computedStyle.marginRight, 10);
  return menuItem.offsetWidth + marginLeft + marginRight || 0;
}

function calcSliceIndex() {
  if (!menu.value) {
    return -1;
  }
  const items = [...(menu.value?.childNodes ?? [])].filter(
    (item) =>
      // remove comment type node #12634
      item.nodeName !== '#comment' &&
      (item.nodeName !== '#text' || item.nodeValue),
  ) as HTMLElement[];

  const moreItemWidth = 46;
  const computedMenuStyle = getComputedStyle(menu?.value);

  const paddingLeft = Number.parseInt(computedMenuStyle.paddingLeft, 10);
  const paddingRight = Number.parseInt(computedMenuStyle.paddingRight, 10);
  const menuWidth = menu.value?.clientWidth - paddingLeft - paddingRight;

  let calcWidth = 0;
  let sliceIndex = 0;
  items.forEach((item, index) => {
    calcWidth += calcMenuItemWidth(item);
    if (calcWidth <= menuWidth - moreItemWidth) {
      sliceIndex = index + 1;
    }
  });
  return sliceIndex === items.length ? -1 : sliceIndex;
}

function debounce(fn: () => void, wait = 33.34) {
  let timmer: ReturnType<typeof setTimeout> | null;
  return () => {
    timmer && clearTimeout(timmer);
    timmer = setTimeout(() => {
      fn();
    }, wait);
  };
}

let isFirstTimeRender = true;
function handleResize() {
  if (sliceIndex.value === calcSliceIndex()) {
    return;
  }
  const callback = () => {
    sliceIndex.value = -1;
    nextTick(() => {
      sliceIndex.value = calcSliceIndex();
    });
  };
  callback();
  // // execute callback directly when first time resize to avoid shaking
  isFirstTimeRender ? callback() : debounce(callback)();
  isFirstTimeRender = false;
}

function getActivePaths() {
  const activeItem = activePath.value && items.value[activePath.value];

  if (!activeItem || props.mode === 'horizontal' || props.collapse) {
    return [];
  }

  return activeItem.parentPaths;
}

// 默认展开菜单
function initMenu() {
  const parentPaths = getActivePaths();

  // 展开该菜单项的路径上所有子菜单
  // expand all subMenus of the menu item
  parentPaths.forEach((path) => {
    const subMenu = subMenus.value[path];
    subMenu && openMenu(path, subMenu.parentPaths);
  });
}

function updateActiveName(val: string) {
  const itemsInData = items.value;
  const item =
    itemsInData[val] ||
    (activePath.value && itemsInData[activePath.value]) ||
    itemsInData[props.defaultActive || ''];

  activePath.value = item ? item.path : val;
}

function handleMenuItemClick(data: MenuItemClicked) {
  const { collapse, mode } = props;
  if (mode === 'horizontal' || collapse) {
    openedMenus.value = [];
  }
  const { parentPaths, path } = data;
  if (!path || !parentPaths) {
    return;
  }
  if (!isHttpUrl(path)) {
    activePath.value = path;
  }

  emit('select', path, parentPaths);
}

function handleSubMenuClick({ parentPaths, path }: MenuItemRegistered) {
  const isOpened = openedMenus.value.includes(path);

  if (isOpened) {
    closeMenu(path, parentPaths);
  } else {
    openMenu(path, parentPaths);
  }
}

function close(path: string) {
  const i = openedMenus.value.indexOf(path);

  if (i !== -1) {
    openedMenus.value.splice(i, 1);
  }
}

/**
 * 关闭、折叠菜单
 */
function closeMenu(path: string, parentPaths: string[]) {
  if (props.accordion) {
    openedMenus.value = subMenus.value[path]?.parentPaths;
  }

  close(path);

  emit('close', path, parentPaths);
}

/**
 * 点击展开菜单
 */
function openMenu(path: string, parentPaths: string[]) {
  if (openedMenus.value.includes(path)) {
    return;
  }
  // 手风琴模式菜单
  if (props.accordion) {
    const activeParentPaths = getActivePaths();
    if (activeParentPaths.includes(path)) {
      parentPaths = activeParentPaths;
    }
    openedMenus.value = openedMenus.value.filter((path: string) =>
      parentPaths.includes(path),
    );
  }
  openedMenus.value.push(path);
  emit('open', path, parentPaths);
}

function addMenuItem(item: MenuItemRegistered) {
  items.value[item.path] = item;
}

function addSubMenu(subMenu: MenuItemRegistered) {
  subMenus.value[subMenu.path] = subMenu;
}

function removeSubMenu(subMenu: MenuItemRegistered) {
  Reflect.deleteProperty(subMenus.value, subMenu.path);
}

function removeMenuItem(item: MenuItemRegistered) {
  Reflect.deleteProperty(items.value, item.path);
}
</script>
<template>
  <ul
    ref="menu"
    :class="[
      b(),
      is(mode, true),
      is(theme, true),
      is('rounded', rounded),
      is('collapse', collapse),
    ]"
    :style="menuStyle"
    role="menu"
  >
    <template v-if="mode === 'horizontal' && getSlot.showSlotMore">
      <template v-for="item in getSlot.slotDefault" :key="item.key">
        <component :is="item" />
      </template>
      <SubMenu is-sub-menu-more path="sub-menu-more">
        <template #title>
          <IcRoundMoreHoriz />
        </template>
        <template v-for="item in getSlot.slotMore" :key="item.key">
          <component :is="item" />
        </template>
      </SubMenu>
    </template>
    <template v-else>
      <slot></slot>
    </template>
  </ul>
</template>
