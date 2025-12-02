<script setup lang="ts">
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { Page, useVbenModal } from '@vben/common-ui';

import { Picture as IconPicture } from '@element-plus/icons-vue';
import {
  ElButton,
  ElCol,
  ElIcon,
  ElImage,
  ElMessage,
  ElMessageBox,
  ElRow,
} from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteUserApi, getUserPageApi } from '#/api/core/user';

import UserDrawer from './model.vue';

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

const [Modal, modalApi] = useVbenModal({
  connectedComponent: UserDrawer,
  animationType: 'scale',
  onClosed: () => gridApi.reload(),
});

function onAddUser() {
  modalApi.setData({ mode: 'create' }).setState({ title: '新增用户' }).open();
}

function onEditUser(row: RowType) {
  modalApi
    .setData({ mode: 'edit', record: row })
    .setState({ title: '编辑用户' })
    .open();
}

async function onDeleteUser(row: RowType) {
  try {
    await ElMessageBox.confirm('确认删除该用户？', '提示', { type: 'warning' });
    await deleteUserApi([row.id]);
    ElMessage.success('删除成功');
    await gridApi.reload();
  } catch (error: any) {
    if (typeof error === 'string' && (error === 'cancel' || error === 'close'))
      return;
    if (
      error?.action &&
      (error.action === 'cancel' || error.action === 'close')
    )
      return;
    ElMessage.error('删除失败');
  }
}
</script>

<template>
  <Page auto-content-height>
    <Modal class="w-[600px]" />
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
            <ElButton
              type="danger"
              link
              size="small"
              @click="() => onDeleteUser(row)"
            >
              删除
            </ElButton>
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
