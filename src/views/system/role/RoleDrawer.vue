<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="500px"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #menus="{ model, field }">
        <Tree
          ref="treeRef"
          v-model:value="model[field]"
          v-model:checkedKeys="checkedKeys"
          :tree-data="treeData"
          :field-names="{ title: 'name', key: 'id' }"
          checkable
          toolbar
          title="菜单分配"
        />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed, unref, toRaw } from 'vue';
  import { Tree } from 'ant-design-vue';
  import { TreeDataItem } from 'ant-design-vue/lib/tree';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { TreeItem } from '/@/components/Tree';
  import { getMenuList } from '/@/api/system/menu';
  import { createRole, updateRole, getRoleInfo } from '/@/api/system/role';
  import { formSchema } from './role.data';

  const emit = defineEmits(['success', 'register']);

  const rowId = ref<number>(0);
  const isUpdate = ref(true);
  const treeData = ref<any[]>([]);
  const checkedKeys = ref<number[]>([]);
  const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 90,
    schemas: formSchema,
    showActionButtonGroup: false,
  });

  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields();
    setDrawerProps({ confirmLoading: false });
    // 需要在setFieldsValue之前先填充treeData，否则Tree组件可能会报key not exist警告
    if (unref(treeData).length === 0) {
      treeData.value = (await getMenuList()) as any as TreeItem[];
    }
    isUpdate.value = !!data?.isUpdate;

    if (unref(isUpdate)) {
      rowId.value = data.record.id;

      const roleInfo = await getRoleInfo(data.record.id);
      checkedKeys.value = getCheckedKeys(roleInfo.menuIds, toRaw(treeData.value));
      setFieldsValue({
        ...data.record,
      });
    }
  });
  const treeRef = ref<Nullable<any>>(null);
  const getTitle = computed(() => (!unref(isUpdate) ? '新增角色' : '编辑角色'));

  const getCheckedKeys = (checkedList: number[], options: TreeDataItem[], total = []) => {
    return options.reduce<number[]>((prev, curr) => {
      if (curr.children?.length) {
        getCheckedKeys(checkedList, curr.children, total);
      } else {
        if (checkedList.includes(curr.id)) {
          prev.push(curr.id);
        }
      }
      return prev;
    }, total);
  };

  async function handleSubmit() {
    try {
      const values = await validate();
      setDrawerProps({ confirmLoading: true });

      const data = {
        ...values,
        menuIds: [...unref(treeRef).checkedKeys, ...unref(treeRef).halfCheckedKeys],
      };

      if (!unref(isUpdate)) {
        await createRole(data);
      } else {
        await updateRole(rowId.value, data);
      }

      closeDrawer();
      emit('success');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
