/**
 * Global authority directive
 * Used for fine-grained control of component permissions
 * @Example v-auth="RoleEnum.TEST"
 */
import type { App, Directive, DirectiveBinding } from 'vue';

import { appStore } from '/@/store/modules/app';
import { usePermission } from '/@/hooks/web/usePermission';
import { PermissionModeEnum } from '/@/enums/appEnum';
const { hasPermission } = usePermission();

function isAuth(el: Element, binding: any) {
  const value = binding.value;
  if (!value) return;
  if (!hasPermission(value)) {
    el.parentNode?.removeChild(el);
  }
}

function isBackMode() {
  return appStore.getProjectConfig.permissionMode === PermissionModeEnum.BACK;
}

const mounted = (el: Element, binding: DirectiveBinding<any>) => {
  if (isBackMode()) return;
  isAuth(el, binding);
};

const updated = (el: Element, binding: DirectiveBinding<any>) => {
  if (!isBackMode()) return;
  isAuth(el, binding);
};

const authDirective: Directive = {
  mounted,
  updated,
};

export function setupPermissionDirective(app: App) {
  app.directive('auth', authDirective);
}

export default authDirective;
