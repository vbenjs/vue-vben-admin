<script lang="tsx">
  import { defineComponent, PropOptions } from 'compatible-vue';

  import { AuthModeEnum } from '@/enums/appEnum';
  import { RoleEnum } from '@/enums/roleEnum';

  import { getSlot } from '@/utils/helper/tsxHelper';

  import { useAuth } from '@/hooks/core/useAuth';

  export default defineComponent({
    name: 'Authority',
    props: {
      // 指定角色可见
      roles: {
        type: [Number, Array, String],
      } as PropOptions<RoleEnum | RoleEnum[]>,

      // 权限模式
      authMode: {
        type: Number,
        default: AuthModeEnum.ROLE,
      } as PropOptions<AuthModeEnum>,
    },
    setup(props, { slots }) {
      /**
       * 渲染角色按钮
       */
      function renderRoleAuth() {
        const { roles } = props;
        const { hasAuth } = useAuth();
        return hasAuth(roles!) ? getSlot(slots, 'default') : null;
      }
      return () => {
        const { authMode } = props;
        // 基于角色渲染
        if (authMode === AuthModeEnum.ROLE) {
          return renderRoleAuth();
        }
        // TODO 基于后台渲染
        return getSlot(slots, 'default');
      };
    },
  });
</script>
