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

      code: {
        type: [String],
      } as PropOptions<string>,
      // 权限模式
      authMode: {
        type: String,
        default: AuthModeEnum.ROLE,
      } as PropOptions<AuthModeEnum>,
    },
    setup(props, { slots }) {
      /**
       * 渲染角色按钮
       */
      function renderRoleAuth() {
        const { roles } = props;
        if (!roles) {
          return getSlot(slots, 'default');
        }
        const { hasRoleAuth } = useAuth();
        return hasRoleAuth(roles) ? getSlot(slots, 'default') : null;
      }

      /**
       * 渲染编码按钮
       * 这里只判断是否包含，具体实现可以根据项目自行写逻辑
       */
      function renderCodeAuth() {
        const { code } = props;
        if (!code) {
          return getSlot(slots, 'default');
        }
        const { hasCodeAuth } = useAuth();
        return hasCodeAuth(code) ? getSlot(slots, 'default') : null;
      }
      return () => {
        const { authMode } = props;
        // 基于角色渲染
        if (authMode === AuthModeEnum.ROLE) {
          return renderRoleAuth();
        }
        // 基于后台编码渲染
        if (authMode === AuthModeEnum.BACK) {
          return renderCodeAuth();
        }
        // TODO 基于后台渲染
        return getSlot(slots, 'default');
      };
    },
  });
</script>
