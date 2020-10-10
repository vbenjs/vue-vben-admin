<template>
  <div class="p-4 m-4 demo">
    <Alert
      message="目前mock了两组数据， id为1 和 2 具体返回的菜单可以在mock/sys/menu.ts内查看"
      show-icon
    />
    <CurrentPermissionMode />

    <Alert class="mt-4" type="info" message="点击后请查看左侧菜单变化" show-icon />

    <div class="mt-4">
      权限切换(请先切换权限模式为后台权限模式):
      <a-button-group>
        <a-button @click="changeMenu('1')"> 获取用户id为1的菜单 </a-button>
        <a-button @click="changeMenu('2')"> 获取用户id为2的菜单 </a-button>
      </a-button-group>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { Alert } from 'ant-design-vue';
  import CurrentPermissionMode from '../CurrentPermissionMode.vue';
  import { RoleEnum } from '/@/enums/roleEnum';
  import { usePermission } from '/@/hooks/web/usePermission';

  export default defineComponent({
    components: { Alert, CurrentPermissionMode },
    setup() {
      const { changeMenu } = usePermission();
      return {
        RoleEnum,
        changeMenu,
      };
    },
  });
</script>
<style lang="less" scoped>
  .demo {
    background: #fff;
  }
</style>
