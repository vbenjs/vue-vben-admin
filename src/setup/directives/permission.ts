import { appStore } from '/@/store/modules/app';
import type { App } from 'vue';
import { usePermission } from '/@/hooks/web/usePermission';
import { PermissionModeEnum } from '/@/enums/appEnum';
const { hasPermission } = usePermission();

function isAuth(el: Element, binding: any) {
  const value = binding.value;
  if (!value) return;
  if (!hasPermission(value)) {
    if (el.parentNode) {
      el.parentNode.removeChild(el);
    }
  }
}
function isBackMode() {
  return appStore.getProjectConfig.permissionMode === PermissionModeEnum.BACK;
}
export function setupPermissionDirective(app: App) {
  app.directive('auth', {
    mounted(el: Element, binding) {
      if (isBackMode()) return;
      isAuth(el, binding);
    },
    updated(el: Element, binding) {
      if (!isBackMode()) return;
      isAuth(el, binding);
    },
  });
}
