<!--
 Access control component for fine-grained access control.
-->
<script lang="ts">
  import type { PropType } from 'vue';
  import { defineComponent, unref } from 'vue';

  import { PermissionModeEnum } from '/@/enums/appEnum';
  import { RoleEnum } from '/@/enums/roleEnum';

  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import { usePermission } from '/@/hooks/web/usePermission';

  import { getSlot } from '/@/utils/helper/tsxHelper';

  export default defineComponent({
    name: 'Authority',
    props: {
      /**
       * Specified role is visible
       * When the permission mode is the role mode, the value value can pass the role value.
       * When the permission mode is background, the value value can pass the code permission value
       * @default ''
       */
      value: {
        type: [Number, Array, String] as PropType<RoleEnum | RoleEnum[] | string | string[]>,
        default: '',
      },
    },
    setup(props, { slots }) {
      const { getPermissionMode } = useRootSetting();
      const { hasPermission } = usePermission();

      /**
       * Render role button
       */
      function renderRoleAuth() {
        const { value } = props;
        if (!value) {
          return getSlot(slots);
        }
        return hasPermission(value) ? getSlot(slots) : null;
      }

      //  Render coding button
      // Here only judge whether it is included, the specific implementation can be written according to the project logic
      function renderCodeAuth() {
        const { value } = props;
        if (!value) {
          return getSlot(slots);
        }
        return hasPermission(value) ? getSlot(slots) : null;
      }

      return () => {
        const mode = unref(getPermissionMode);
        // Role-based value control
        if (mode === PermissionModeEnum.ROLE) {
          return renderRoleAuth();
        }

        // Based on background role permission control
        if (mode === PermissionModeEnum.BACK) {
          return renderCodeAuth();
        }

        return getSlot(slots);
      };
    },
  });
</script>
