<script lang="tsx">
  import { defineComponent } from 'compatible-vue';

  import { Button } from 'ant-design-vue';
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
          <div>
            <p>当前角色: [{permissionStore.getRoleState.toString()}]</p>
            <p>点击后请查看左侧菜单变化</p>
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
