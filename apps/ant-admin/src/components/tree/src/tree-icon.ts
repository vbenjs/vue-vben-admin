import type { VNode, FunctionalComponent } from 'vue'
import { h } from 'vue'
import { isString } from '@pkg/utils'
import { Icon } from '@components/common'

export const TreeIcon: FunctionalComponent = ({
  icon,
}: {
  icon: VNode | string
}) => {
  if (!icon) return null
  if (isString(icon)) {
    return h(Icon, { icon, class: 'mr-1' })
  }
  return Icon
}
