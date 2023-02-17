<script lang="ts" setup>
  import { ref, unref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { Row as ARow, Transfer } from 'ant-design-vue';
  import { listRoles, RoleEntity } from '/@/apis/roles';
  import { listUserRoleIds, setUserRoleIds } from '/@/apis/users';
  const userId = ref<Nullable<number>>(null);
  const roles = ref<RoleEntity[]>([]);
  const targetKeys = ref<string[]>([]);
  const selectedKeys = ref<string[]>([]);
  const [registerDrawer, { changeLoading, changeOkLoading, closeDrawer }] = useDrawerInner(
    async (data) => {
      changeLoading(true);
      userId.value = data.id;
      roles.value = (await listRoles({ page: 0, size: 9999 })).content || [];
      targetKeys.value = ((await listUserRoleIds(data.id)) || []).map((id) => id.toString());
      changeLoading(false);
    },
  );
  const emit = defineEmits(['success', 'register']);
  async function handleSubmit() {
    try {
      changeOkLoading(true);
      await setUserRoleIds(
        unref(userId)!,
        unref(targetKeys).map((id) => parseInt(id)),
      );
      closeDrawer();
      emit('success');
    } finally {
      changeOkLoading(false);
    }
  }
</script>
<template>
  <div>
    <basic-drawer
      v-bind="$attrs"
      @register="registerDrawer"
      showFooter
      title="角色配置"
      width="600px"
      @ok="handleSubmit"
    >
      <a-row type="flex" justify="center">
        <transfer
          v-model:target-keys="targetKeys"
          v-model:selected-keys="selectedKeys"
          :data-source="roles"
          :row-key="(role: RoleEntity) => role.id.toString()"
          :titles="['角色列表', '用户角色']"
          :render="(role: RoleEntity) => role.name"
          :list-style="{ height: '600px' }"
          show-search
        />
      </a-row>
    </basic-drawer>
  </div>
</template>
