<template>
  <div class="p-10 m-4 rounded-md bg-white">
    <Alert
      message="由于刷新的时候会请求用户信息接口，会根据接口重置角色信息，所以刷新后界面会恢复原样，如果不需要，可以注释 src/layout/default/index内的获取用户信息接口"
      show-icon
    />
    <CurrentPermissionMode />

    <p>
      当前角色: <a> {{ userStore.getRoleListState }} </a>
    </p>
    <Alert class="mt-4" type="info" message="点击后请查看左侧菜单变化" show-icon />

    <div class="mt-4">
      权限切换(请先切换权限模式为前端角色权限模式):
      <a-button-group>
        <a-button @click="changeRole(RoleEnum.SUPER)" :type="isSuper ? 'primary' : ''">
          {{ RoleEnum.SUPER }}
        </a-button>
        <a-button @click="changeRole(RoleEnum.TEST)" :type="isTest ? 'primary' : ''">
          {{ RoleEnum.TEST }}
        </a-button>
      </a-button-group>
    </div>
  </div>
</template>
<script lang="ts">
  import { computed, defineComponent } from 'vue';
  import { Alert } from 'ant-design-vue';
  import CurrentPermissionMode from '../CurrentPermissionMode.vue';
  import { userStore } from '/@/store/modules/user';
  import { RoleEnum } from '/@/enums/roleEnum';
  import { usePermission } from '/@/hooks/web/usePermission';

  export default defineComponent({
    components: { Alert, CurrentPermissionMode },
    setup() {
      const { changeRole } = usePermission();
      return {
        userStore,
        RoleEnum,
        isSuper: computed(() => userStore.getRoleListState.includes(RoleEnum.SUPER)),
        isTest: computed(() => userStore.getRoleListState.includes(RoleEnum.TEST)),
        changeRole,
      };
    },
  });
</script>
