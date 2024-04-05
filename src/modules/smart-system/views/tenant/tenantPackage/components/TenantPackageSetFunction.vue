<template>
  <a-layout class="full-height" :class="prefixCls">
    <a-layout-header class="header">
      <h3>{{ t('system.views.tenant.package.title.setFunction') }}</h3>
    </a-layout-header>
    <Divider style="margin: 0" />
    <a-layout-content class="content">
      <Spin :spinning="dataLoading">
        <BasicTree
          ref="treeRef"
          checkable
          :treeData="functionTreeData"
          v-model:checkedKeys="checkedKeysModel"
        />
      </Spin>
    </a-layout-content>

    <Divider style="margin: 0" />
    <a-layout-footer class="footer">
      <div style="padding: 0 5px">
        <a-button :loading="saveLoading" block type="primary" @click="handleSave">
          {{ $t('common.button.save') }}
        </a-button>
      </div>
    </a-layout-footer>
  </a-layout>
</template>

<script setup lang="ts">
  import { useI18n } from '@/hooks/web/useI18n';
  import { Divider, Spin } from 'ant-design-vue';
  import { useDesign } from '@/hooks/web/useDesign';
  import { onMounted, ref, unref, watch } from 'vue';
  import { BasicTree } from '@/components/Tree';
  import {
    listFunctionApi,
    listFunctionIdApi,
    savePackageFunctionApi,
  } from '../SysTenantPackageListView.api';
  import TreeUtils from '@/utils/TreeUtils';
  import { propTypes } from '@/utils/propTypes';
  import { errorMessage, successMessage } from '@/utils/message/SystemNotice';

  const props = defineProps({
    tenantPackageId: propTypes.number,
  });

  const treeRef = ref();

  const dataLoading = ref(false);
  const saveLoading = ref(false);

  const { t } = useI18n();

  const { prefixCls } = useDesign('system-tenant-package-setFunction');

  onMounted(() => loadFunctionTreeData());
  watch(
    () => props.tenantPackageId,
    () => loadPackageFunctionIds(),
  );

  const functionTreeData = ref<Array<any>>([]);
  const checkedKeysModel = ref([]);

  const loadFunctionTreeData = async () => {
    dataLoading.value = true;
    try {
      const functionList = await listFunctionApi({
        sortName: 'seq',
      });
      functionTreeData.value =
        TreeUtils.convertList2Tree(
          functionList.map(({ functionId, functionName, parentId }: any) => {
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

  const loadPackageFunctionIds = async () => {
    const tenantPackageId = props.tenantPackageId;
    if (!tenantPackageId) {
      checkedKeysModel.value = [];
    } else {
      dataLoading.value = true;
      try {
        checkedKeysModel.value = await listFunctionIdApi(tenantPackageId);
      } finally {
        dataLoading.value = false;
      }
    }
  };

  /**
   * 保存操作
   */
  const handleSave = async () => {
    const tenantPackageId = props.tenantPackageId;
    if (!tenantPackageId) {
      errorMessage(t('system.views.tenant.package.message.chosePackage'));
      return false;
    }
    const tree = unref(treeRef);
    saveLoading.value = true;
    try {
      await savePackageFunctionApi({
        tenantPackageId,
        functionIdList: tree.getAntInstance().checkedKeys,
        halfFunctionIdList: tree.getAntInstance().halfCheckedKeys,
      });
      successMessage(t('system.views.tenant.package.message.saveFunctionSuccess'));
    } finally {
      saveLoading.value = false;
    }
  };
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-system-tenant-package-setFunction';

  .@{prefix-cls} {
    .header {
      height: 48px;
      background: white;
      line-height: 48px;
      text-align: center;
    }

    .content {
      overflow: auto;
      background: white;
    }

    .footer {
      height: 50px;
      padding: 10px 0;
      background: white;
      text-align: center;
    }
  }
</style>
