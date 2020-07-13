<script lang="tsx">
  import { defineComponent } from 'compatible-vue';
  import { Button } from 'ant-design-vue';
  import Authority from '@/components/authority/index.vue';

  import { permissionStore } from '@/store/modules/permission';
  import { RoleEnum } from '@/enums/roleEnum';

  import { useAuth } from '@/hooks/core/useAuth';
  export default defineComponent({
    name: 'BtnAuth',
    setup() {
      const { changeRole, hasAuth } = useAuth();
      return () => {
        const isAdmin = permissionStore.getRoleState.includes(RoleEnum.ADMIN);
        const isNormal = permissionStore.getRoleState.includes(RoleEnum.NORMAL);
        return (
          <div>
            <p>当前角色: [{permissionStore.getRoleState.toString()}]</p>
            <Button.Group>
              <Button
                type={isAdmin ? 'primary' : ''}
                onClick={changeRole.bind(null, RoleEnum.ADMIN)}
              >
                {RoleEnum.ADMIN}
              </Button>
              <Button
                type={isNormal ? 'primary' : ''}
                onClick={changeRole.bind(null, RoleEnum.NORMAL)}
              >
                {RoleEnum.NORMAL}
              </Button>
            </Button.Group>

            <div class="p-10">
              <h1>组件方式控制</h1>

              <Authority roles={RoleEnum.ADMIN}>
                <Button type="primary" block>
                  Admin角色可见
                </Button>
              </Authority>

              <Authority roles={RoleEnum.NORMAL}>
                <Button class="mt-5" type="primary" block>
                  Normal角色可见
                </Button>
              </Authority>

              <Authority roles={[RoleEnum.NORMAL, RoleEnum.ADMIN]}>
                <Button class="mt-5" type="primary" block>
                  Admin,Normal角色可见
                </Button>
              </Authority>

              <h1>函数方式控制</h1>
              <h3>主要用于不适合写标签的地方,如 tabs可以用遍历过滤进行生成</h3>

              {hasAuth(RoleEnum.ADMIN) && (
                <Button type="primary" block>
                  Admin角色可见
                </Button>
              )}

              {hasAuth(RoleEnum.NORMAL) && (
                <Button class="mt-5" type="primary" block>
                  Normal角色可见
                </Button>
              )}

              {hasAuth([RoleEnum.NORMAL, RoleEnum.ADMIN]) && (
                <Button class="mt-5" type="primary" block>
                  Admin,Normal角色可见
                </Button>
              )}
            </div>
          </div>
        );
      };
    },
  });
</script>
