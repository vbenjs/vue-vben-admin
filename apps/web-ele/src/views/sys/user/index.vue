<script setup lang="ts">
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { Page, useVbenDrawer } from '@vben/common-ui';

import { Picture as IconPicture } from '@element-plus/icons-vue';
import { ElButton, ElCol, ElIcon, ElImage, ElRow } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getUserPageApi } from '#/api/core/user';

import UserDrawer from './drawer.vue';

interface RowType {
  id: number;
  username: string;
  avatar: string;
  roleIdList: number[];
}

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户名',
      },
      fieldName: 'username',
      label: '用户名',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          {
            label: '角色1',
            value: '1',
          },
          {
            label: '角色2',
            value: '2',
          },
        ],
        placeholder: '请选择角色',
      },
      fieldName: 'roleIdList',
      label: '角色',
    },
  ],
  // 控制表单是否显示折叠按钮
  showCollapseButton: false,
  submitButtonOptions: {
    content: '查询',
  },
  // 是否在字段值改变时提交表单
  submitOnChange: false,
  // 按下回车时是否提交表单
  submitOnEnter: false,
};

const gridOptions: VxeGridProps<RowType> = {
  checkboxConfig: {
    highlight: true,
    labelField: 'name',
  },
  columns: [
    { title: '序号', type: 'seq', width: 50 },
    { align: 'center', title: '用户名', field: 'username' },
    {
      field: 'avatar',
      slots: { default: 'avatar' },
      align: 'center',
      title: '头像',
    },
    {
      align: 'center',
      title: '角色',
      field: 'roleIdList',
      slots: { default: 'roleid-list' },
    },
    {
      field: 'action',
      slots: { default: 'action' },
      title: '操作',
      width: 140,
    },
  ],
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    response: {
      result: 'list',
      total: 'total',
    },
    ajax: {
      query: async ({ page }, formValues) => {
        return await getUserPageApi({
          page: page.currentPage,
          limit: page.pageSize,
          ...formValues,
        });
      },
    },
  },
  toolbarConfig: {
    // 是否显示搜索表单控制按钮
    // @ts-ignore
    search: true,
  },
};

const [Grid, gridApi] = useVbenVxeGrid({ formOptions, gridOptions });

const [Drawer, drawerApi] = useVbenDrawer({
  connectedComponent: UserDrawer,
  onClosed: () => gridApi.reload(),
});

function onAddUser() {
  drawerApi.setData({ mode: 'create' }).setState({ title: '新增用户' }).open();
}

function onEditUser(row: RowType) {
  drawerApi
    .setData({ mode: 'edit', record: row })
    .setState({ title: '编辑用户' })
    .open();
}
</script>

<template>
  <Page auto-content-height>
    <Drawer class="w-[600px]" />
    <Grid>
      <template #toolbar-actions>
        <ElButton type="primary" size="small" @click="onAddUser">
          新增用户
        </ElButton>
      </template>
      <template #avatar="{ row }">
        <ElImage :src="row.avatar || ''" style="width: 30px; height: 30px">
          <template #error>
            <ElIcon size="30"><IconPicture /></ElIcon>
          </template>
        </ElImage>
      </template>
      <template #roleid-list="{ row }">
        <div v-if="row.roleIdList && row.roleIdList.length > 0">
          <el-tag
            v-for="roleId in row.roleIdList"
            :key="roleId"
            size="mini"
            style="margin-right: 4px"
          >
            角色 {{ roleId }}
          </el-tag>
        </div>
        <div v-else>
          <span>无角色</span>
        </div>
      </template>
      <template #action="{ row }">
        <ElRow :gutter="8">
          <ElCol :span="12">
            <ElButton
              type="primary"
              link
              size="small"
              @click="() => onEditUser(row)"
            >
              编辑
            </ElButton>
          </ElCol>
          <ElCol :span="12">
            <ElButton type="danger" link size="small">删除</ElButton>
          </ElCol>
        </ElRow>
      </template>
    </Grid>
  </Page>
</template>

<style scoped lang="scss">
.app-container {
  padding: 20px;
}
</style>
