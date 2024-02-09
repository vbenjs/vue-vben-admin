<template>
  <div class="full-height dept-container" style="padding: 10px">
    <div class="full-height left-tree" style="padding: 10px; background: white">
      <div>
        <a-button
          v-permission="'sys:dept:save'"
          type="primary"
          :size="buttonSizeConfig"
          @click="handleAdd"
        >
          <plus-outlined />
          {{ $t('common.button.add') }}
        </a-button>
        <a-button
          type="primary"
          v-permission="'sys:dept:save'"
          :size="buttonSizeConfig"
          style="margin-left: 5px"
          @click="handleAddChild"
        >
          <plus-outlined />
          {{ $t('system.views.dept.button.addChild') }}
        </a-button>
        <a-button
          type="primary"
          style="margin-left: 5px"
          v-permission="'sys:dept:delete'"
          danger
          :size="buttonSizeConfig"
          @click="handleDelete"
        >
          <delete-outlined />
          {{ $t('common.button.delete') }}
        </a-button>
      </div>
      <sys-dept-tree style="margin-top: 5px" ref="treeRef" show-search @select="handleTreeSelect" />
    </div>
    <div class="full-height right-tab">
      <a-tabs>
        <a-tab-pane :tab="$t('system.views.dept.title.baseMessage')">
          <sys-dept-edit ref="formRef" :filter-field="false" :dept-id="currentDeptRef?.deptId" />
          <div style="text-align: right">
            <a-button
              :loading="saveLoading"
              @click="handleSave"
              :disabled="currentDeptRef === null || currentDeptRef === undefined"
              style=" margin-right: 10px;text-align: right"
              type="primary"
            >
              {{ $t('common.button.save') }}
            </a-button>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
    <SysDeptEditModal @after-save="reloadDeptTree" @register="registerModal" />
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { useI18n } from 'vue-i18n';

  import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue';

  import { useSizeSetting } from '@/hooks/setting/UseSizeSetting';
  import { useModal } from '@/components/Modal';
  import { errorMessage, successMessage } from '@/utils/message/SystemNotice';

  import SysDeptTree from './components/SysDeptTree.vue';
  import SysDeptEdit from './components/SysDeptEdit.vue';
  import SysDeptEditModal from './components/SysDeptEditModal.vue';
  import { deleteApi, saveUpdateBatchApi } from './SysDept.api';
  import { useVxeDelete } from '@/hooks/web/useCrud';

  /**
   * 部门管理树
   */
  export default defineComponent({
    name: 'SysDeptTreeList',
    components: {
      SysDeptTree,
      PlusOutlined,
      DeleteOutlined,
      SysDeptEdit,
      SysDeptEditModal,
    },
    setup() {
      const gridRef = ref();
      const treeRef = ref();
      const formRef = ref();

      const { t } = useI18n();
      const parentFieldVisible = ref(false);

      const [registerModal, { openModal }] = useModal();

      /**
       * 当前选中节点的code
       */
      const currentDeptRef = ref<Recordable | null>(null);
      const handleTreeSelect = (_: Array<number>, { selectedNodes, selected }) => {
        if (!selected || selectedNodes.length === 0) {
          currentDeptRef.value = null;
        }
        currentDeptRef.value = selectedNodes[0];
      };

      const reloadDeptTree = () => {
        treeRef.value.reload();
      };

      /**
       * 添加操作函数
       */
      const handleAdd = () => {
        openModal(true, {
          parentId: 0,
          parentName: '根',
        });
      };
      /**
       * 添加下级
       */
      const handleAddChild = () => {
        const currentDept = unref(currentDeptRef);
        if (!currentDept) {
          errorMessage(t('system.views.dept.message.selectDeptError'));
          return false;
        }
        const { deptId, deptName } = unref(currentDeptRef) || {};
        openModal(true, {
          parentId: deptId,
          parentName: deptName,
        });
      };

      /**
       * 删除hook
       */
      const { handleDeleteById } = useVxeDelete(null, t, deleteApi, {
        idField: 'deptId',
        afterDelete: () => reloadDeptTree(),
      });
      const handleDelete = () => {
        const currentDept = unref(currentDeptRef);
        if (!currentDept) {
          errorMessage(t('common.notice.deleteChoose'));
          return false;
        }
        handleDeleteById(currentDept.deptId);
      };

      /**
       * 保存操作
       */
      const saveLoading = ref(false);
      const handleSave = async () => {
        const formModel = await unref(formRef).validate();
        try {
          saveLoading.value = true;
          await saveUpdateBatchApi([formModel]);
          console.log();
          successMessage(t('common.message.saveSuccess'));
          await reloadDeptTree();
        } finally {
          saveLoading.value = false;
        }
      };
      return {
        gridRef,
        treeRef,
        handleTreeSelect,
        parentFieldVisible,
        handleDelete,
        ...useSizeSetting(),
        handleAdd,
        registerModal,
        reloadDeptTree,
        currentDeptRef,
        handleAddChild,
        formRef,
        handleSave,
        saveLoading,
      };
    },
  });
</script>

<style lang="less" scoped>
  @leftWidth: 40%;

  .left-tree {
    display: inline-block;
    width: @leftWidth;
  }

  .right-tab {
    display: inline-block;
    width: calc(60% - 10px);
    margin-left: 10px;
    padding: 10px;
    float: right;
    background: white;

    :deep(.ant-tabs) {
      height: 100%;

      .ant-tabs-content {
        height: 100%;
      }
    }
  }
</style>
