<script lang="tsx">
  import { defineComponent } from 'compatible-vue';
  import { Alert } from 'ant-design-vue';
  import { Authority } from '@/components/authority/index';
  import CurrentAuthMode from '../CurrentAuthMode.vue';

  import { permissionStore } from '@/store/modules/permission';
  import { RoleEnum } from '@/enums/roleEnum';

  import { useAuth } from '@/hooks/core/useAuth';
  export default defineComponent({
    name: 'BtnAuth',
    setup() {
      const { changeRole, hasRoleAuth } = useAuth();
      return () => {
        const isAdmin = permissionStore.getRoleState.includes(RoleEnum.ADMIN);
        const isNormal = permissionStore.getRoleState.includes(RoleEnum.NORMAL);
        return (
          <div class="p-4">
            <Alert
              class="my-5"
              message="由于刷新的时候会请求用户信息接口，会根据接口重置角色信息，所以刷新后界面会恢复原样，如果不需要，可以注释 src/layout/default/index.vue内的获取用户信息接口"
              type="info"
              show-icon
            />
            <CurrentAuthMode />
            <p>当前角色: [{permissionStore.getRoleState.toString()}]</p>
            权限切换(请先切换权限模式为前端权限模式)：
            <a-button-group>
              <a-button
                type={isAdmin ? 'primary' : ''}
                onClick={changeRole.bind(null, RoleEnum.ADMIN)}
              >
                {RoleEnum.ADMIN}
              </a-button>
              <a-button
                type={isNormal ? 'primary' : ''}
                onClick={changeRole.bind(null, RoleEnum.NORMAL)}
              >
                {RoleEnum.NORMAL}
              </a-button>
            </a-button-group>
            <div class="p-10">
              <h1>组件方式控制</h1>

              <Authority roles={RoleEnum.ADMIN}>
                <a-button type="primary" block>
                  Admin角色可见
                </a-button>
              </Authority>

              <Authority roles={RoleEnum.NORMAL}>
                <a-button class="mt-5" type="primary" block>
                  Normal角色可见
                </a-button>
              </Authority>

              <Authority roles={[RoleEnum.NORMAL, RoleEnum.ADMIN]}>
                <a-button class="mt-5" type="primary" block>
                  Admin,Normal角色可见
                </a-button>
              </Authority>

              <h1>函数方式控制</h1>
              <h3>主要用于不适合写标签的地方,如 tabs可以用遍历过滤进行生成</h3>

              {hasRoleAuth(RoleEnum.ADMIN) && (
                <a-button type="primary" block>
                  Admin角色可见
                </a-button>
              )}

              {hasRoleAuth(RoleEnum.NORMAL) && (
                <a-button class="mt-5" type="primary" block>
                  Normal角色可见
                </a-button>
              )}

              {hasRoleAuth([RoleEnum.NORMAL, RoleEnum.ADMIN]) && (
                <a-button class="mt-5" type="primary" block>
                  Admin,Normal角色可见
                </a-button>
              )}
            </div>
          </div>
        );
      };
    },
  });
</script>
