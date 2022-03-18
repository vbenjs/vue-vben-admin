import type { Slots } from 'vue'
import { isFunction } from '../is'

/**
 * @description:  Get slot to prevent empty error
 */
export const getSlot = (slots: Slots, slot = 'default', data?: any) => {
  if (!slots || !Reflect.has(slots, slot)) {
    return null
  }
  if (!isFunction(slots[slot])) {
    console.error(`${slot} is not a function!`)
    return null
  }
  const slotFn = slots[slot]
  if (!slotFn) return null
  return slotFn(data)
}

/**
 * extends slots
 * @param slots
 * @param excludeKeys
 */
export const extendSlots = (slots: Slots, excludeKeys: string[] = []) => {
  const slotKeys = Object.keys(slots)
  const ret: any = {}
  slotKeys.map((key) => {
    if (excludeKeys.includes(key)) {
      return null
    }
    ret[key] = () => getSlot(slots, key)
  })
  return ret
}
