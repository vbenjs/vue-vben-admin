<template>
  <ul :class="getClass">
    <slot></slot>
  </ul>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import type { SubMenuProvider } from './types'
import {
  defineComponent,
  ref,
  computed,
  onMounted,
  watchEffect,
  watch,
  nextTick,
  getCurrentInstance,
  provide,
} from 'vue'
import { useDesign } from '@/hooks/web/useDesign'
import { createSimpleRootMenuContext } from './useSimpleMenuContext'
import { mitt } from '@admin/utils'
export default defineComponent({
  name: 'Menu',
  props: {
    theme: {
      type: String,
      default: 'light',
      validator: (v: string) => ['light', 'dark'].includes(v),
    },
    activeName: { type: [Number, String] },
    openNames: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    accordion: { type: Boolean, default: true },
    width: { type: String, default: '100%' },
    collapsedWidth: { type: String, default: '48px' },
    indentSize: { type: Number, default: 16 },
    collapse: { type: Boolean, default: true },
    activeSubMenuNames: {
      type: Array as PropType<(string | number)[]>,
      default: () => [],
    },
  },
  emits: ['select', 'open-change'],
  setup(props, { emit }) {
    const rootMenuEmitter = mitt()
    const instance = getCurrentInstance()

    const currentActiveName = ref<string | number>('')
    const openedNames = ref<string[]>([])

    const { prefixCls } = useDesign('menu')

    const isRemoveAllPopup = ref(false)

    createSimpleRootMenuContext({
      rootMenuEmitter: rootMenuEmitter,
      activeName: currentActiveName,
    })

    const getClass = computed(() => {
      const { theme } = props
      return [
        prefixCls,
        `${prefixCls}-${theme}`,
        `${prefixCls}-vertical`,
        {
          [`${prefixCls}-collapse`]: props.collapse,
        },
      ]
    })

    watchEffect(() => {
      openedNames.value = props.openNames
    })

    watchEffect(() => {
      if (props.activeName) {
        currentActiveName.value = props.activeName
      }
    })

    watch(
      () => props.openNames,
      () => {
        nextTick(() => {
          updateOpened()
        })
      },
    )

    function updateOpened() {
      rootMenuEmitter.emit('on-update-opened', openedNames.value)
    }

    function addSubMenu(name: string) {
      if (openedNames.value.includes(name)) return
      openedNames.value.push(name)
      updateOpened()
    }

    function removeSubMenu(name: string) {
      openedNames.value = openedNames.value.filter((item) => item !== name)
      updateOpened()
    }

    function removeAll() {
      openedNames.value = []
      updateOpened()
    }

    function sliceIndex(index: number) {
      if (index === -1) return
      openedNames.value = openedNames.value.slice(0, index + 1)
      updateOpened()
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
    })

    onMounted(() => {
      openedNames.value = !props.collapse ? [...props.openNames] : []
      updateOpened()
      rootMenuEmitter.on('on-menu-item-select', (name: string) => {
        currentActiveName.value = name

        nextTick(() => {
          props.collapse && removeAll()
        })
        emit('select', name)
      })

      rootMenuEmitter.on('open-name-change', ({ name, opened }) => {
        if (opened && !openedNames.value.includes(name)) {
          openedNames.value.push(name)
        } else if (!opened) {
          const index = openedNames.value.findIndex((item) => item === name)
          index !== -1 && openedNames.value.splice(index, 1)
        }
      })
    })

    return { getClass, openedNames }
  },
})
</script>
<style lang="less">
@import './menu.less';
</style>
