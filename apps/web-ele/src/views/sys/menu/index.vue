<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { MenuData } from '#/api/core/menu';

import { cloneDeep } from '@vben/utils';

import { ElButton, ElText, ElTooltip } from 'element-plus';

import { z } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getDiffTypeMenuListApi } from '#/api/core/menu';

interface RowType {
  id: number;
  pid: null | number;
  name: string;
  url: string;
  type: 0 | 1 | 2;
  sort: number;
  createTime: null | string;
  parentName: null | string;
  meta: {
    authority: null | string;
    icon: string;
    title: string;
  };
  children: [] | RowType[];
}

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
            value: '0',
          },
          {
            label: '按钮',
            value: '1',
          },
          {
            label: '接口',
            value: '2',
          },
          {
            label: '全部',
            value: undefined,
          },
        ],
      },
      fieldName: 'type',
      label: '菜单类型',
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
      query: async () => {
        const transformation = (item: MenuData): RowType => {
          const {
            id,
            pid,
            name,
            url,
            type,
            sort,
            createTime,
            parentName,
            meta,
          } = item;
          const children =
            Array.isArray(item.children) && item.children.length > 0
              ? item.children.map((child) => transformation(child))
              : [];
          return {
            id,
            pid,
            name,
            url,
            type,
            sort,
            createTime,
            parentName,
            meta,
            children,
          };
        };
        const respData = await getDiffTypeMenuListApi('menu');
        return respData.map((item) => transformation(item));
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

// TODO: 获取菜单的真实路径
const getFullPath = (row: RowType, _data = gridOptions.data) => {
  // 搜索
  const data: RowType[] = cloneDeep(_data)!;
  const record = [];
  for (let i = 0; i < data?.length; i++) {
    if (data?.[i]?.id === row.id) {
      record.push(data?.[i]?.url);
      break;
    }
    // 如果最后一项也没有找到
    if (i === data?.length - 1) {
      // getFullPath(row)
    }
  }
};

const handleAddMenu = () => {};

const handleEditMenu = (id: number) => {};

const handleDeleteMenu = (id: number) => {};
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
        <!-- TODO: 待完成菜单 -->
        <template v-else>
          <ElText type="primary">{{ row.url }}</ElText>
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
