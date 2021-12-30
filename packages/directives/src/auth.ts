/**
 * Global authority directive
 * Used for fine-grained control of component permissions
 * @Example v-auth="RoleEnum.TEST"
 */
import type { Directive, DirectiveBinding } from 'vue'

import { context } from '../_bridge'

const isAuth = (el: Element, binding: any) => {
  const value = binding.value
  if (!value) return
  if (!context.hasPermission(value)) {
    el.parentNode?.removeChild(el)
  }
}

const mounted = (el: Element, binding: DirectiveBinding<any>) => {
  isAuth(el, binding)
}

const auth: Directive = {
  mounted,
}

export { auth }
