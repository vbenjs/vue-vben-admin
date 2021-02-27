import type { Router } from 'vue-router';
import { Modal, notification } from 'ant-design-vue';
import projectSetting from '/@/settings/projectSetting';
import { warn } from '/@/utils/log';

/**
 * Used to close the message instance when the route is switched
 * @param router
 */
export function createMessageGuard(router: Router) {
  const { closeMessageOnSwitch } = projectSetting;

  router.beforeEach(async () => {
    try {
      if (closeMessageOnSwitch) {
        Modal.destroyAll();
        notification.destroy();
      }
    } catch (error) {
      warn('message guard error:' + error);
    }
    return true;
  });
}
