/**
 * Global authority directive
 * Used for fine-grained control of component permissions
 * @Example v-auth="RoleEnum.TEST"
 */
import type { App, Directive, DirectiveBinding } from 'vue';

import { usePermission } from '@/hooks/web/usePermission';
import { unref } from 'vue';
import { NoPermissionModeEnum } from '@/enums/appEnum';
import { RoleEnum } from '@/enums/roleEnum';

function isAuth(el: Element, binding: any) {
  const { hasPermission } = usePermission();

  const value = binding.value;
  if (!value) return;
  if (!hasPermission(value)) {
    el.parentNode?.removeChild(el);
  }
}

const mounted = (el: Element, binding: DirectiveBinding<string | string[] | RoleEnum[]>) => {
  isAuth(el, binding);
};

const authDirective: Directive = {
  mounted,
};

const permissionDirective: Directive = {
  beforeMount(el, binding) {
    const permission = binding.value;
    if (!permission) {
      return;
    }
    const { hasPermission, getNoPermissionMode } = usePermission();
    const has = hasPermission(permission);
    if (!has) {
      const noPermissionMode = unref(getNoPermissionMode);
      if (el.type === 'button') {
        if (noPermissionMode === NoPermissionModeEnum.disabled) {
          el.disabled = true;
        } else if (noPermissionMode === NoPermissionModeEnum.hide) {
          el.style.display = 'none';
        }
      }
      // TODO:其他情况未处理
    }
  },
};

export function setupPermissionDirective(app: App) {
  app.directive('auth', authDirective);
  app.directive('permission', permissionDirective);
}

export default authDirective;
