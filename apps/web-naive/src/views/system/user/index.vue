<template>
  <Page>
    <template #extra>
      <div style="display: flex">
        <QueryForm />
        <n-button
          style="margin-left: 20px"
          type="success"
          @click="addSyetemuser"
        >
          新增后台用户
        </n-button>
      </div>
    </template>

    <!-- 表格 -->
    <NDataTable
      :columns="TableColumns"
      :data="systemUser"
      :pagination="pagination"
    />

    <!-- 表单 -->
    <Modal
      class="w-[600px]"
      :title="fromConfig.isAdd ? '新增用户' : '编辑用户'"
      :footer="false"
      :draggable="true"
      :submitting="fromConfig.submitting"
    >
      <BaseForm />
    </Modal>
  </Page>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { getALLSystemUser } from '#/api/core/system/user';
import { Page } from '@vben/common-ui';
import { NDataTable, NButton } from 'naive-ui';
import {
  createModalConfig,
  createTableColumns,
  createBaseForm,
  createQueryForm,
} from './config';

// 系统用户数据
let systemUser: any = reactive([]);

// 表单配置
let fromConfig = reactive({
  submitting: false,
  isAdd: false,
});

// 查询参数
const defaultQueryParams = {
  nickname: '',
  telephone: '',
  mailbox: '',
  status: null,
};

let queryParams = reactive({ ...defaultQueryParams });

// 分页配置（将在createTableColumns中初始化）
let pagination: any;

// 初始化函数
const init = (isReset = false) => {
  if (isReset) {
    Object.assign(queryParams, defaultQueryParams);
    pagination.page = 1;
  }
  const query = {
    ...queryParams,
    page: pagination.page,
    pageSize: pagination.pageSize,
  };

  getALLSystemUser(query).then((res) => {
    systemUser.length = 0;
    systemUser.push(...(res.data?.data || []));
    pagination.itemCount = res.data?.total || 0;
  });
};

// 打开新增用户表单
const addSyetemuser = () => {
  fromConfig.isAdd = true;
  modalApi.open();
};

const { Modal, modalApi } = createModalConfig();

// 表单
const { BaseForm, formApi } = createBaseForm(modalApi, {
  init,
  fromConfig,
});

// 表格 & 分页
const tableConfig = createTableColumns(modalApi, formApi, {
  init,
  fromConfig,
});
const { TableColumns } = tableConfig;
pagination = tableConfig.pagination;

// 查询表单
const { QueryForm, queryFormApi } = createQueryForm({
  init: (value: any, isReset = false) => {
    Object.assign(queryParams, value);
    pagination.page = 1;
    init(isReset);
  },
});
init();
</script>

<style scoped></style>
