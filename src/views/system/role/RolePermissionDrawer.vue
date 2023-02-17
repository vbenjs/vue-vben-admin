<script lang="ts" setup>
  import { ref, unref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicTree, TreeItem } from '/@/components/Tree';
  import { listPermissionTree } from '/@/apis/permissions';
  import { listRoleCheckedPermissionIds, roleAuthorize } from '/@/apis/roles';

  import { treeNode2TreeData } from '../helpers';

  const roleId = ref<Nullable<number>>(null);
  const treeData = ref<TreeItem[]>([]);
  const checkedKeys = ref<number[]>([]);
  const halfCheckedKeys = ref<number[]>([]);

  const [registerDrawer, { changeLoading, changeOkLoading, closeDrawer }] = useDrawerInner(
    async (data) => {
      changeLoading(true);
      roleId.value = data.id;
      treeData.value = treeNode2TreeData((await listPermissionTree()) || []);
      checkedKeys.value = (await listRoleCheckedPermissionIds(data.id)) || [];
      changeLoading(false);
    },
  );

  function handleCheck(checkedKeys: number[], e: { halfCheckedKeys: number[] }) {
    halfCheckedKeys.value = e.halfCheckedKeys;
  }

  const emit = defineEmits(['success', 'register']);

  async function handleSubmit() {
    try {
      changeOkLoading(true);
      const id = unref(roleId);
      await roleAuthorize(id!, {
        checkedIds: unref(checkedKeys),
        halfCheckedIds: unref(halfCheckedKeys),
      });
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
      <basic-tree
        checkable
        :tree-data="treeData"
        v-model:checked-keys="checkedKeys"
        @check="handleCheck"
      />
    </basic-drawer>
  </div>
</template>
