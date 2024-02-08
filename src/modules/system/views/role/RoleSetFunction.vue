<template>
  <a-layout class="full-height">
    <a-layout-header style="height: 48px; background: white; line-height: 48px; text-align: center">
      <h3>{{ $t('system.views.role.title.setFunction') }}</h3>
    </a-layout-header>
    <Divider style="margin: 0" />
    <a-layout-content style=" overflow: auto;background: white">
      <Spin :spinning="dataLoading">
        <a-tree
          ref="treeRef"
          v-model:checkedKeys="checkedKeysModel"
          :tree-data="functionTreeData"
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

<script lang="ts">
  import { defineComponent, ref, onMounted, toRefs, watch, unref } from 'vue';
  import type { PropType } from 'vue';

  import { message, Spin, Divider } from 'ant-design-vue';

  import TreeUtils from '@/utils/TreeUtils';

  import { SystemPermissions } from '@/modules/system/constants/SystemConstants';
  import { ApiServiceEnum, defHttp } from '@/utils/http/axios';

  /**
   * 设置角色对应的功能
   */
  export default defineComponent({
    name: 'RoleSetFunction',
    components: {
      Spin,
      Divider,
    },
    props: {
      roleId: {
        type: Number as PropType<number>,
        default: null,
      },
    },
    setup(props) {
      const { roleId } = toRefs(props);
      const treeRef = ref();
      // 树形控件数据
      const functionTreeData = ref<Array<any>>([]);
      const dataLoading = ref(false);
      const saveLoading = ref(false);
      const checkedKeysModel = ref([]);

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
        if (roleId.value !== null) {
          dataLoading.value = true;
          try {
            checkedKeysModel.value = await defHttp.post({
              service: ApiServiceEnum.SMART_SYSTEM,
              url: 'sys/role/listFunctionId',
              params: {
                id: unref(roleId),
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
        if (roleId.value === null) {
          message.error('请先选定角色');
          return false;
        }
        saveLoading.value = true;
        try {
          await defHttp.post({
            service: ApiServiceEnum.SMART_SYSTEM,
            url: 'sys/role/saveRoleMenu',
            data: {
              roleId: roleId.value,
              functionIdList: tree.checkedKeys,
              halfFunctionIdList: tree.halfCheckedKeys,
            },
          });
          message.success('保存成功');
        } finally {
          saveLoading.value = false;
        }
      };
      watch(roleId, loadRoleFunctions);
      onMounted(loadFunctionTreeData);
      return {
        functionTreeData,
        dataLoading,
        saveLoading,
        checkedKeysModel,
        handleSave,
        permissions: SystemPermissions.role,
        treeRef,
      };
    },
  });
</script>

<style scoped></style>
