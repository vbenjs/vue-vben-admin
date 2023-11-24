<template>
  <ul :class="getClass">
    <slot></slot>
  </ul>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import type { SubMenuProvider } from './types';
  import {
    ref,
    computed,
    onMounted,
    watchEffect,
    watch,
    nextTick,
    getCurrentInstance,
    provide,
  } from 'vue';
  import { useDesign } from '@/hooks/web/useDesign';
  import { propTypes } from '@/utils/propTypes';
  import { createSimpleRootMenuContext, type MenuEmitterEvents } from './useSimpleMenuContext';
  import { mitt } from '@/utils/mitt';

  defineOptions({ name: 'Menu' });

  const props = defineProps({
    theme: propTypes.oneOf(['light', 'dark']).def('light'),
    activeName: propTypes.oneOfType([propTypes.string, propTypes.number]),
    openNames: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    accordion: propTypes.bool.def(true),
    width: propTypes.string.def('100%'),
    collapsedWidth: propTypes.string.def('48px'),
    indentSize: propTypes.number.def(16),
    collapse: propTypes.bool.def(true),
    activeSubMenuNames: {
      type: Array as PropType<(string | number)[]>,
      default: () => [],
    },
  });

  const emit = defineEmits(['select', 'open-change']);

  const rootMenuEmitter = mitt<MenuEmitterEvents>();
  const instance = getCurrentInstance();

  const currentActiveName = ref<string | number>('');
  const openedNames = ref<(string | number)[]>([]);

  const { prefixCls } = useDesign('menu');

  const isRemoveAllPopup = ref(false);

  createSimpleRootMenuContext({
    rootMenuEmitter: rootMenuEmitter,
    activeName: currentActiveName,
  });

  const getClass = computed(() => {
    const { theme } = props;
    return [
      prefixCls,
      `${prefixCls}-${theme}`,
      `${prefixCls}-vertical`,
      {
        [`${prefixCls}-collapse`]: props.collapse,
      },
    ];
  });

  watchEffect(() => {
    openedNames.value = props.openNames;
  });

  watchEffect(() => {
    if (props.activeName) {
      currentActiveName.value = props.activeName;
    }
  });

  watch(
    () => props.openNames,
    () => {
      nextTick(() => {
        updateOpened();
      });
    },
  );

  function updateOpened() {
    rootMenuEmitter.emit('on-update-opened', openedNames.value);
  }

  function addSubMenu(name: string | number) {
    if (openedNames.value.includes(name)) return;
    openedNames.value.push(name);
    updateOpened();
  }

  function removeSubMenu(name: string | number) {
    openedNames.value = openedNames.value.filter((item) => item !== name);
    updateOpened();
  }

  function removeAll() {
    openedNames.value = [];
    updateOpened();
  }

  function sliceIndex(index: number) {
    if (index === -1) return;
    openedNames.value = openedNames.value.slice(0, index + 1);
    updateOpened();
  }

  provide<SubMenuProvider>(`subMenu:${instance?.uid}`, {
    addSubMenu,
    removeSubMenu,
    getOpenNames: () => openedNames.value,
    removeAll,
    isRemoveAllPopup,
    sliceIndex,
    level: 0,
    props: props as any,
  });

  onMounted(() => {
    openedNames.value = !props.collapse ? [...props.openNames] : [];
    updateOpened();
    rootMenuEmitter.on('on-menu-item-select', (name: string | number) => {
      currentActiveName.value = name;

      nextTick(() => {
        props.collapse && removeAll();
      });
      emit('select', name);
    });

    rootMenuEmitter.on('open-name-change', ({ name, opened }) => {
      if (opened && !openedNames.value.includes(name)) {
        openedNames.value.push(name);
      } else if (!opened) {
        const index = openedNames.value.findIndex((item) => item === name);
        index !== -1 && openedNames.value.splice(index, 1);
      }
    });
  });
</script>
<style lang="less">
  @import url('./menu.less');
</style>
