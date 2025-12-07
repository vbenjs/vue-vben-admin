<script lang="ts" setup>
import type { RowType } from './';

import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { ElButton, ElText, ElTooltip } from 'element-plus';

import { z } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getDiffTypeMenuListApi } from '#/api/core/menu';

import { getFullPath, transformationBackendToTable } from './';

const formOptions: VbenFormProps = {
  collapsed: false,
  schema: [
    {
      component: 'Select',
      componentProps: {
        placeholder: '请输入菜单名',
        options: [
          {
            label: '菜单',
            value: 'menu',
          },
          {
            label: '按钮',
            value: 'button',
          },
          {
            label: '接口',
            value: 'interface',
          },
          {
            label: '全部',
            value: 'all',
          },
        ],
      },
      fieldName: 'type',
      label: '菜单类型',
      defaultValue: 'menu',
      rules: z.string(z.number().gte(0).lte(2)),
    },
  ],
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
  columns: [
    { field: 'id', align: 'center', width: 80, title: 'id' },
    {
      field: 'name',
      align: 'center',
      minWidth: 120,
      title: '菜单名称',
      treeNode: true,
    },
    {
      field: 'type',
      slots: { default: 'type' },
      align: 'center',
      title: '类型',
    },
    { field: 'url', slots: { default: 'url' }, align: 'center', title: '路径' },
    {
      field: 'action',
      slots: { default: 'action' },
      title: '操作',
      width: 150,
    },
  ],
  data: [],
  keepSource: true,
  height: 'auto',
  toolbarConfig: {
    refresh: true,
    refreshOptions: {
      icon: 'vxe-icon-refresh',
      iconLoading: 'vxe-icon-refresh roll',
    },
  },
  pagerConfig: {
    enabled: false,
  },
  treeConfig: {
    childrenField: 'children',
    parentField: 'pid',
    rowField: 'id',
    accordion: true, // 手风琴效果
  },
  proxyConfig: {
    autoLoad: true,
    response: {
      list: ({ data }) => {
        return data;
      },
    },
    ajax: {
      query: async (_, formValues) => {
        const respData = await getDiffTypeMenuListApi(formValues.type);
        gridApi.setGridOptions({
          data: respData.map((item) => transformationBackendToTable(item)),
        });
        return respData.map((item) => transformationBackendToTable(item));
      },
    },
  },
};
const [Grid, gridApi] = useVbenVxeGrid({ gridOptions, formOptions });

const typeMap = new Map([
  [0, '菜单'],
  [1, '按钮'],
  [2, '接口'],
]);

const handleAddMenu = () => {};

// const handleEditMenu = (id: number) => {};

// const handleDeleteMenu = (id: number) => {};
</script>

<template>
  <div class="h-[500px] w-full p-5">
    <Grid>
      <template #toolbar-actions>
        <ElButton type="primary" size="small" @click="handleAddMenu">
          新增菜单
        </ElButton>
      </template>
      <template #type="{ row }">
        <template v-if="typeMap.has(row.type)">
          <ElText type="success">{{ typeMap.get(row.type) }}</ElText>
        </template>
      </template>
      <template #url="{ row }">
        <!-- 目录 -->
        <template v-if="Array.isArray(row.children) && row.children.length > 0">
          <ElTooltip :content="row.url" placement="top">
            <ElText type="primary"> # </ElText>
          </ElTooltip>
        </template>
        <template v-else>
          <ElText type="primary">
            {{
              getFullPath(
                row.id,
                gridApi?.state?.gridOptions?.data as RowType[],
              )
            }}
          </ElText>
        </template>
      </template>
      <template #action="{ row }">
        <ElButton
          type="primary"
          link
          size="small"
          @click="handleEditMenu(row.id)"
        >
          编辑
        </ElButton>
        <ElButton
          type="danger"
          link
          size="small"
          @click="handleDeleteMenu(row.id)"
        >
          删除
        </ElButton>
      </template>
    </Grid>
  </div>
</template>
