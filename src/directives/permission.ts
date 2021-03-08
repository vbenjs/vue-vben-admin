/**
 * Global authority directive
 * Used for fine-grained control of component permissions
 * @Example v-auth="RoleEnum.TEST"
 */
import type { App, Directive, DirectiveBinding } from 'vue';

import projectSetting from '/@/settings/projectSetting';
import { usePermission } from '/@/hooks/web/usePermission';
import { PermissionModeEnum } from '/@/enums/appEnum';

function isAuth(el: Element, binding: any) {
  const { hasPermission } = usePermission();

  const value = binding.value;
  if (!value) return;
  if (!hasPermission(value)) {
    el.parentNode?.removeChild(el);
  }
}

function isBackMode() {
  return projectSetting.permissionMode === PermissionModeEnum.BACK;
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
