<script lang="ts" setup>
  import { ref, unref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicTree, TreeItem } from '/@/components/Tree';
  import { listPermissionTree } from '/@/apis/permissions';
  import TreeNode from '/@/apis/TreeNode';
  import { listRoleCheckedPermissionIds, roleAuthorize } from '/@/apis/roles';

  const roleId = ref<Nullable<number>>(null);
  const treeData = ref<TreeItem[]>([]);
  const checkedKeys = ref<number[]>([]);
  const halfCheckedKeys = ref<number[]>([]);

  function treeNode2TreeData(treeNodes: TreeNode[]): TreeItem[] {
    const result: TreeItem[] = [];
    treeNodes.forEach((node) => {
      const temp: TreeItem = { key: node.id, title: node.name };
      if (node.children) {
        temp.children = treeNode2TreeData(node.children);
      }
      result.push(temp);
    });
    return result;
  }

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
