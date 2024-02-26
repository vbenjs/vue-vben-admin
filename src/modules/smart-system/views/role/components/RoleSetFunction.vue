<template>
  <a-layout class="full-height">
    <a-layout-header style="height: 48px; background: white; line-height: 48px; text-align: center">
      <h3>{{ t('system.views.role.title.setFunction') }}</h3>
    </a-layout-header>
    <Divider style="margin: 0" />
    <a-layout-content style="overflow: auto; background: white">
      <Spin :spinning="dataLoading">
        <BasicTree
          ref="treeRef"
          :treeData="functionTreeData"
          v-model:checkedKeys="checkedKeysModel"
          checkable
        />
      </Spin>
    </a-layout-content>
    <Divider style="margin: 0" />
    <a-layout-footer style="height: 50px; padding: 10px 0; background: white; text-align: center">
      <div style="padding: 0 5px">
        <a-button
          v-permission="permissions.setFunction"
          :loading="saveLoading"
          block
          type="primary"
          @click="handleSave"
        >
          {{ $t('common.button.save') }}
        </a-button>
      </div>
    </a-layout-footer>
  </a-layout>
</template>

<script setup lang="ts">
  import { useI18n } from '@/hooks/web/useI18n';
  import { Divider, Spin } from 'ant-design-vue';
  import { onMounted, ref, unref, watch } from 'vue';
  import { ApiServiceEnum, defHttp } from '@/utils/http/axios';
  import TreeUtils from '@/utils/TreeUtils';
  import { SystemPermissions } from '@/modules/smart-system/constants/SystemConstants';
  import { errorMessage, successMessage } from '@/utils/message/SystemNotice';
  import { propTypes } from '@/utils/propTypes';
  import { BasicTree } from '@/components/Tree';

  const props = defineProps({
    roleId: propTypes.number,
  });

  const treeRef = ref();
  const { t } = useI18n();

  // 树形控件数据
  const functionTreeData = ref<Array<any>>([]);
  const dataLoading = ref(false);
  const saveLoading = ref(false);
  const checkedKeysModel = ref([]);
  const permissions = SystemPermissions.role;

  onMounted(() => loadFunctionTreeData());
  watch(
    () => props.roleId,
    () => loadRoleFunctions(),
  );

  /**
   * 加载功能树函数
   */
  const loadFunctionTreeData = async () => {
    dataLoading.value = true;
    try {
      const result = await defHttp.post({
        service: ApiServiceEnum.SMART_SYSTEM,
        url: 'sys/function/list',
        data: {
          sortName: 'seq',
        },
      });
      functionTreeData.value =
        TreeUtils.convertList2Tree(
          result.map(({ functionId, functionName, parentId }: any) => {
            return {
              key: functionId,
              title: functionName,
              parentId: parentId,
            };
          }),
          (item) => item.key,
          (item) => item.parentId,
          0,
        ) || [];
    } finally {
      dataLoading.value = false;
    }
  };

  /**
   * 加载角色对应的功能ID
   */
  const loadRoleFunctions = async () => {
    if (props.roleId !== null) {
      dataLoading.value = true;
      try {
        checkedKeysModel.value = await defHttp.post({
          service: ApiServiceEnum.SMART_SYSTEM,
          url: 'sys/role/listFunctionId',
          params: {
            id: props.roleId,
          },
        });
      } finally {
        dataLoading.value = false;
      }
    }
  };

  /**
   * 执行保存操作
   */
  const handleSave = async () => {
    const tree = unref(treeRef);
    if (props.roleId === null) {
      errorMessage('请先选定角色');
      return false;
    }
    // const treeDataList = getTreeDataList();
    // const treeDataMap = new Map<number, any>();
    // treeDataList.forEach((item) => {
    //   treeDataMap.set(item.key, item);
    // });
    // const checkedKeys = tree.getCheckedKeys().filter((item) => {
    //   if (!treeDataMap.has(item)) {
    //     return false;
    //   }
    //   const treeData = treeDataMap.get(item);
    //   return treeData.hasChild !== true;
    // });
    saveLoading.value = true;
    try {
      await defHttp.post({
        service: ApiServiceEnum.SMART_SYSTEM,
        url: 'sys/role/saveRoleMenu',
        data: {
          roleId: props.roleId,
          functionIdList: tree.getCheckedKeys(),
          halfFunctionIdList: tree.halfCheckedKeys,
        },
      });
      successMessage('保存成功');
    } finally {
      saveLoading.value = false;
    }
  };

  // const getTreeDataList = () => {
  //   const treeData = unref(treeRef).getTreeData();
  //   const treeDataList: any[] = [];
  //   doGetTreeDataList(treeDataList, treeData);
  //   return treeDataList;
  // };
  //
  // const doGetTreeDataList = (treeDataList: any[], treeData: any[]) => {
  //   treeData.forEach((item) => {
  //     treeDataList.push(item);
  //     if (item.children && item.children.length > 0) {
  //       doGetTreeDataList(treeDataList, item.children);
  //     }
  //   });
  // };
</script>

<style scoped lang="less"></style>
