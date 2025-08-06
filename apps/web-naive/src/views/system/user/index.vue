<template>
  <Page>
    <template #extra>
      <n-button type="primary" @click="addSyetemuser"> 新增后台用户 </n-button>
    </template>
    <!-- 表格 -->
    <NDataTable :columns="TableColumns" :data="systemUser" />

    <!-- 表单 -->
    <Modal
      class="w-[600px]"
      :title="fromConfig.isAdd ? '新增用户' : '编辑用户'"
      :footer="false"
      :draggable="true"
      :submitting="fromConfig.submitting"
    >
      <BaseForm> </BaseForm>
    </Modal>
  </Page>
</template>

<script setup lang="ts">
import { getALLSystemUser } from '#/api/core/system/user';
import { reactive } from 'vue';
import { Page } from '@vben/common-ui';
import { NDataTable, NButton, useDialog, useMessage } from 'naive-ui';

import {
  createModalConfig,
  createTableColumns,
  createBaseForm,
} from './config';

// 系统用户
let systemUser: any = reactive([]);

// 表单配置
let fromConfig = reactive({
  submitting: false,
  isAdd: false,
});

// naiveui组件
const NDialog = useDialog();
const NMessage = useMessage();

// 初始化函数
const init = () => {
  getALLSystemUser().then((res) => {
    systemUser.length = 0;
    systemUser.push(...(res.data?.data || []));
  });
};
init();

const addSyetemuser = () => {
  fromConfig.isAdd = true;
  // 打开模态框
  modalApi.open();
};

const { Modal, modalApi } = createModalConfig();

// 创建表单配置
const { BaseForm, formApi } = createBaseForm(modalApi, {
  init,
  fromConfig,
});

// 创建表格配置
const TableColumns = createTableColumns(modalApi, formApi, {
  init,
  fromConfig,
  naiveComponents: {
    NDialog,
    NMessage,
  },
});
</script>

<style scoped></style>
