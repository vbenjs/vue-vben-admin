<template>
  <div class="m-4 mr-0 overflow-hidden flex flex-col">
    <div class="flex-1 mb-2">
      <BasicTree
        ref="menuTree"
        v-model:value="selectedCodes"
        :treeData="treeData"
        :fieldNames="{ title: 'menuName', key: 'id' }"
        :checkable="!!selectedRoleId"
        toolbar
        check-strictly
        :checked-keys="checkedCodes"
        :default-expand-all="true"
        emptyDesc="请在左侧选择要修改权限的角色"
        title="菜单分配"
      />
    </div>
    <div v-if="selectedRoleId" class="flex h-13 mb-1 justify-around">
      <div class="flex flex-col">
        <span class="mb-1 text-sm text-gray-500 flex justify-center">
          配置完成后，记得点击按钮进行保存
        </span>
        <a-button class="w-xs" type="primary" @click="save">保存</a-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, unref } from 'vue';

  import { BasicTree, TreeActionType, TreeItem } from '@/components/Tree';
  import { useMessage } from '@/hooks/web/useMessage';
  import { getMenuList } from '@/api/menu';
  import { updatePerm } from '@/api/account/role';

  const props = defineProps<{
    selectedRoleId?: string;
    checkedCodes?: string[];
  }>();

  const { notification } = useMessage();

  const menuTree = ref<Nullable<TreeActionType>>(null);
  const treeData = ref<TreeItem[]>([]);
  const selectedCodes = ref<{
    checked?: string[];
    halfChecked?: string[];
  }>({});

  const fetchMenuList = async () => {
    const list = await getMenuList();
    treeData.value = list as unknown as TreeItem[];
    setTimeout(() => {
      const asyncTreeAction: TreeActionType | null = unref(menuTree);
      if (asyncTreeAction) {
        asyncTreeAction.expandAll(true);
      }
    }, 30);
  };

  fetchMenuList();

  const save = async () => {
    console.log('============selectedCodes', selectedCodes.value);
    await updatePerm(props.selectedRoleId, selectedCodes.value.checked);
    notification.success({
      message: '权限配置保存成功',
      description: '请提醒用户刷新后生效',
      duration: 5,
    });
  };
</script>
