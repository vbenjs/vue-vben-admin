<template>
  <Page auto-content-height>
    <!-- 新增表单 -->
    <FormDrawer />
    <Grid table-title="角色列表">
      <template #toolbar-tools>
        <n-button type="primary" @click="onCreate">
          <Plus class="size-5" />
          新增系统角色
        </n-button>
      </template>
    </Grid>
  </Page>
</template>

<script lang="ts" setup>
import { Page, useVbenDrawer } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { NButton } from 'naive-ui';

import { dialog, message } from '#/adapter/naive';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteRole,
  getSystemAllRoles,
  updateRole,
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
    columns: useColumns(onActionClick, onStatusChange) as any,
    height: 'auto',
    keepSource: true,
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
 * 将Antd的Modal.confirm封装为promise，方便在异步函数中调用。
 * @param content 提示内容
 * @param title 提示标题
 */
function confirm(content: string, title: string) {
  return new Promise((reslove, reject) => {
    // dialog.confirm({
    //   content,
    //   onCancel() {
    //     reject(new Error('已取消'));
    //   },
    //   onOk() {
    //     reslove(true);
    //   },
    //   title,
    // });
  });
}

/**
 * 状态开关即将改变
 * @param newStatus 期望改变的状态值
 * @param row 行数据
 * @returns 返回false则中止改变，返回其他值（undefined、true）则允许改变
 */
async function onStatusChange(newStatus: number, row: any) {
  const status: any = {
    0: '禁用',
    1: '启用',
  };
  try {
    await confirm(
      `你要将${row.name}的状态切换为 【${status[newStatus.toString()]}】 吗？`,
      `切换状态`,
    );
    await updateRole(row.id, { status: newStatus });
    return true;
  } catch {
    return false;
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

function onRefresh() {
  gridApi.query();
}

function onCreate() {
  formDrawerApi.setData({}).open();
}
</script>
