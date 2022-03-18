import { isObject } from './is'

export const deepMerge = <T = any>(src: any = {}, target: any = {}): T => {
  let key: string
  for (key in target) {
    src[key] = isObject(src[key])
      ? deepMerge(src[key], target[key])
      : (src[key] = target[key])
  }
  return src
}
