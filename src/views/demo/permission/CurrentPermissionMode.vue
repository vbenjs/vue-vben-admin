<template>
  <div class="mt-2">
    当前权限模式：
    <a-button type="link">
      {{ permissionMode === PermissionModeEnum.BACK ? '后台权限模式' : '前端角色权限模式' }}
    </a-button>
    <a-button class="ml-4" @click="togglePermissionMode" type="primary"> 切换权限模式 </a-button>
    <Divider />
  </div>
</template>
<script lang="ts">
  import { Divider } from 'ant-design-vue';
  import { computed, defineComponent } from 'vue';

  import { PermissionModeEnum } from '@/enums/appEnum';
  import { usePermission } from '@/hooks/web/usePermission';
  import { useAppStore } from '@/store/modules/app';

  export default defineComponent({
    name: 'CurrentPermissionMode',
    components: { Divider },
    setup() {
      const appStore = useAppStore();
      const permissionMode = computed(() => appStore.getProjectConfig.permissionMode);
      const { togglePermissionMode } = usePermission();

      return {
        permissionMode,
        PermissionModeEnum,
        togglePermissionMode,
      };
    },
  });
</script>
