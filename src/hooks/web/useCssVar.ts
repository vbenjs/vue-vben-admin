import { ref, Ref, isRef, watch } from '@vue/runtime-dom'

export default function useCssVar(
  prop: string,
  refEl?: Ref<HTMLElement | null>
) {
  const refVar = ref('')
  let el: HTMLElement = document.documentElement

  if (isRef(refEl)) {
    watch(
      refEl,
      () => {
        if (refEl.value) {
          el = refEl.value as HTMLElement
          refVar.value = getComputedStyle(el).getPropertyValue(prop)
        }
      },
      { immediate: true }
    )
  } else {
    refVar.value = getComputedStyle(el).getPropertyValue(prop)
  }

  watch(
    refVar,
    val => {
      el && el.style.setProperty(prop, val)
    },
    { immediate: true }
  )

  return refVar
}
