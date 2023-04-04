<script lang="ts" setup>
  import { ref, unref } from 'vue';
  import { isArray } from 'lodash-es';

  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';

  import DepartmentTree from '../department/DepartmentTree.vue';

  import { listUserDepartmentIds, setUserDepartmentIds } from '/@/apis/users';

  const userId = ref<Nullable<number>>(null);
  const checkedKeys = ref<number[] | { checked: number[]; halfChecked: number[] }>([]);

  const [registerDrawer, { changeLoading, changeOkLoading, closeDrawer }] = useDrawerInner(
    async (data) => {
      changeLoading(true);
      userId.value = data.id;
      checkedKeys.value = (await listUserDepartmentIds(data.id)) || [];
      console.log('选中的id', checkedKeys);
      changeLoading(false);
    },
  );

  const emit = defineEmits(['success', 'register']);

  async function handleSubmit() {
    try {
      changeOkLoading(true);
      const keys = unref(checkedKeys);
      await setUserDepartmentIds(unref(userId)!, isArray(keys) ? keys : keys.checked);
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
      title="部门配置"
      width="600px"
      @ok="handleSubmit"
    >
      <department-tree checkable check-strictly v-model:checked-keys="checkedKeys" />
    </basic-drawer>
  </div>
</template>
