<script lang="tsx">
  import { defineComponent } from 'compatible-vue';
  import CurrentAuthMode from '../CurrentAuthMode.vue';

  import { Button, Alert } from 'ant-design-vue';
  import { permissionStore } from '@/store/modules/permission';
  import { RoleEnum } from '@/enums/roleEnum';

  import { useAuth } from '@/hooks/core/useAuth';
  export default defineComponent({
    name: 'PageAuth',
    setup() {
      const { changeRole } = useAuth();
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
            <p>点击后请查看左侧菜单变化</p>
            权限切换(请先切换权限模式为前端权限模式)：
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
          </div>
        );
      };
    },
  });
</script>
