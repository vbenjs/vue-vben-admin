import { defineComponent, PropType, computed, unref } from 'vue';

import { PermissionModeEnum } from '/@/enums/appEnum';
import { RoleEnum } from '/@/enums/roleEnum';
import { usePermission } from '/@/hooks/web/usePermission';
import { appStore } from '/@/store/modules/app';
import { getSlot } from '/@/utils/helper/tsxHelper';

export default defineComponent({
  name: 'Authority',
  props: {
    // 指定角色可见
    value: {
      type: [Number, Array, String] as PropType<RoleEnum | RoleEnum[]>,
      default: '',
    },
  },
  setup(props, { slots }) {
    const getModeRef = computed(() => {
      return appStore.getProjectConfig.permissionMode;
    });

    /**
     * 渲染角色按钮
     */
    function renderRoleAuth() {
      const { value } = props;
      if (!value) {
        return getSlot(slots);
      }
      const { hasPermission } = usePermission();
      return hasPermission(value) ? getSlot(slots) : null;
    }

    /**
     * 渲染编码按钮
     * 这里只判断是否包含，具体实现可以根据项目自行写逻辑
     */
    function renderCodeAuth() {
      const { value } = props;
      if (!value) {
        return getSlot(slots);
      }
      const { hasPermission } = usePermission();
      return hasPermission(value) ? getSlot(slots) : null;
    }

    return () => {
      const mode = unref(getModeRef);
      // 基于角色渲染
      if (mode === PermissionModeEnum.ROLE) {
        return renderRoleAuth();
      }
      // 基于后台编码渲染
      if (mode === PermissionModeEnum.BACK) {
        return renderCodeAuth();
      }
      return getSlot(slots);
    };
  },
});
