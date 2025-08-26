<template>
  <Page auto-content-height>
    <!-- 新增表单 -->
    <FormDrawer @success="onRefresh"> </FormDrawer>
    <Grid table-title="角色列表">
      <template #toolbar-tools>
        <n-button type="primary" @click="onCreate">
          <Plus class="size-5" />
          新增系统角色
        </n-button>
      </template>
      <template #status="{ row }">
        <n-switch
          :value="row.status"
          @update:value="(val) => editSystemRoles(val, row)"
        />
      </template>
      <template #operation="{ row }">
        <n-button type="primary" @click="deletRole(row)">
          <Plus class="size-5" />
          删除
        </n-button>
      </template>
    </Grid>
  </Page>
</template>

<script lang="ts" setup>
import { Page, useVbenDrawer } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { NButton, NSwitch } from 'naive-ui';

import { dialog, message } from '#/adapter/naive';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getSystemAllRoles,
  editSystemRolesInfo,
  deleteSystemRoles,
} from '#/api/core/system/role';

import { useColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: Form,
  destroyOnClose: true,
});

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    fieldMappingTime: [['createTime', ['startTime', 'endTime']]],
    schema: useGridFormSchema(),
    submitOnChange: true,
  },
  gridOptions: {
    columns: useColumns(onActionClick) as any,
    height: 'auto',
    keepSource: true,

    // 数据加载
    proxyConfig: {
      autoLoad: true,
      ajax: {
        query: async () => {
          const data = {
            // ...formValues,
          };
          const RoleList = await getSystemAllRoles(data);
          return {
            items: RoleList.data,
            total: 100,
          };
        },
      },
    },
    // 关闭分页
    pagerConfig: {
      enabled: false,
    },
    rowConfig: {
      keyField: 'id',
    },

    toolbarConfig: {
      custom: true,
      export: false,
      refresh: { code: 'query' },
      search: true,
      zoom: true,
    },
  },
});

function onActionClick(e: any) {
  switch (e.code) {
    case 'delete': {
      onDelete(e.row);
      break;
    }
    case 'edit': {
      onEdit(e.row);
      break;
    }
  }
}

/**
 *
 * @param data 修改权限状态
 * @param item
 */
async function editSystemRoles(data: any, row: any) {
  const { id } = row;
  const status = data ? 1 : 0;
  const result = await editSystemRolesInfo({ id, status });
  if (result.code === 200) {
    message.success('修改成功');
    row.status = data;
  } else {
    message.error(result.msg || '修改失败');
  }
}

function onEdit(row: any) {
  formDrawerApi.setData(row).open();
}

function onDelete(row: any) {
  // const hideLoading = message.loading({
  //   content: $t('ui.actionMessage.deleting', [row.name]),
  //   duration: 0,
  //   key: 'action_process_msg',
  // });
  // deleteRole(row.id)
  //   .then(() => {
  //     message.success({
  //       content: $t('ui.actionMessage.deleteSuccess', [row.name]),
  //       key: 'action_process_msg',
  //     });
  //     onRefresh();
  //   })
  //   .catch(() => {
  //     hideLoading();
  //   });
}

// 刷新列表
function onRefresh() {
  gridApi.query();
}

// 新增角色
function onCreate() {
  formDrawerApi.setData({}).open();
}

// 删除角色
function deletRole(row: any) {
  dialog.error({
    title: '删除',
    content: `是否删除角色【${row.role_name}】`,
    positiveText: '确认',
    negativeText: '取消',
    onPositiveClick: async () => {
      const result = await deleteSystemRoles({ id: row.id });
      message.success('删除成功');
      onRefresh();
    },
  });
}
</script>
