<script lang="ts" setup>
import { useAccess } from '@vben/access';
import { useAccessStore } from '@vben-core/stores';

import { Button } from 'ant-design-vue';

defineOptions({ name: 'AccessBackend' });

const { currentAccessMode } = useAccess();
const accessStore = useAccessStore();

function roleButtonType(role: string) {
  return accessStore.getUserRoles.includes(role) ? 'primary' : 'default';
}
</script>

<template>
  <div class="p-5">
    <div class="card-box p-5">
      <h1 class="text-xl font-semibold">前端页面访问演示</h1>
      <div class="text-foreground/80 mt-2">
        由于刷新的时候会请求用户信息接口，会根据接口重置角色信息，所以刷新后界面会恢复原样。如果不需要，可以注释对应的代码。
      </div>
    </div>

    <template v-if="currentAccessMode === 'frontend'">
      <div class="card-box mt-5 p-5 font-semibold">
        当前权限模式:
        <span class="text-primary mx-4">{{ currentAccessMode }}</span>
        <Button type="primary">切换权限模式</Button>
      </div>

      <div class="card-box mt-5 p-5 font-semibold">
        当前用户角色:
        <span class="text-primary mx-4">{{ accessStore.getUserRoles }}</span>
        <Button :type="roleButtonType('admin')"> 切换为 Admin 角色 </Button>
        <Button :type="roleButtonType('user')" class="mx-4">
          切换为 User 角色
        </Button>

        <div class="text-foreground/80 mt-2">角色后请查看左侧菜单变化</div>
      </div>
    </template>
  </div>
</template>
