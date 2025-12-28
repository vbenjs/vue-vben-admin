<script lang="ts" setup>
import type { RowType } from './';

import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps, VxeGridPropTypes } from '#/adapter/vxe-table';

import { computed, ref, unref } from 'vue';

import { confirm, useVbenModal } from '@vben/common-ui';

import { ElButton, ElMessage, ElText, ElTooltip } from 'element-plus';

import { z } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteMenuApi,
  getDiffTypeMenuListApi,
  ListType,
} from '#/api/core/menu';

import { getFullPath, transformationBackendToTable } from './';
import ExtraModel from './modal.vue';

const menuMap = new Map<
  number,
  { title: string; type: 'info' | 'primary' | 'success' }
>([
  [0, { title: '菜单', type: 'primary' }],
  [1, { title: '按钮', type: 'info' }],
  [2, { title: '接口', type: 'success' }],
]);
const gridColumnsMap = new Map<keyof typeof ListType, VxeGridPropTypes.Columns>(
  [
    [
      'all',
      [
        { title: '序号', type: 'seq', width: 50 },
        {
          field: 'name',
          align: 'center',
          width: 150,
          title: '按钮名称',
          treeNode: true,
        },
        {
          field: 'type',
          slots: { default: 'type' },
          align: 'center',
          title: '类型',
        },
        {
          field: 'meta.authority',
          align: 'center',
          title: '权限标识',
        },
        {
          field: 'url',
          align: 'center',
          title: '路径',
        },
      ],
    ],
    [
      'button',
      [
        { title: '序号', type: 'seq', width: 50 },
        {
          field: 'name',
          align: 'center',
          width: 150,
          title: '按钮名称',
          treeNode: true,
        },
        {
          field: 'type',
          slots: { default: 'type' },
          align: 'center',
          title: '类型',
        },
        {
          field: 'meta.authority',
          align: 'center',
          title: '权限标识',
        },
        {
          field: 'url',
          slots: { default: 'button-path' },
          align: 'center',
          title: '组件路径',
        },
        {
          field: 'action',
          slots: { default: 'action' },
          title: '操作',
          width: 150,
        },
      ],
    ],
    [
      'menu',
      [
        { title: '序号', type: 'seq', width: 50 },
        {
          field: 'name',
          align: 'center',
          width: 220,
          title: '菜单名称',
          treeNode: true,
        },
        {
          field: 'type',
          slots: { default: 'type' },
          align: 'center',
          title: '类型',
        },
        {
          field: 'url',
          slots: { default: 'menu-url' },
          align: 'center',
          title: '路径',
        },
        {
          field: 'action',
          slots: { default: 'action' },
          title: '操作',
          width: 150,
        },
      ],
    ],
  ],
);

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
  // 表单值变化回调
  handleValuesChange: (values, fieldsChanged) => {
    const { type } = values;
    // 当菜单类型发送变化时
    if (fieldsChanged.includes('type')) {
      // 同步菜单类型
      const listTypeValue = ListType[type as keyof typeof ListType];
      menuType.value =
        typeof listTypeValue === 'number' ? listTypeValue : undefined;

      // 清空数据
      gridApi.setGridOptions({
        data: [],
      });
      // 重新设置 表格列
      gridApi.setGridOptions({
        columns: gridColumnsMap.get(type),
      });

      // 重新请求
      gridApi.query({ $type: type });
    }
  },
};

const gridOptions: VxeGridProps<RowType> = {
  columns: gridColumnsMap.get('menu'),
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
        // 用户传递的 type 和 表单的type
        const { $type, type } = formValues;
        const respData = await getDiffTypeMenuListApi($type ?? type);
        gridApi.setGridOptions({
          data: respData.map((item) => transformationBackendToTable(item)),
        });
        return respData.map((item) => transformationBackendToTable(item));
      },
    },
  },
};
const [Grid, gridApi] = useVbenVxeGrid({ gridOptions, formOptions });
const gridStore = gridApi.useStore();
// 表格数据
const data = computed<RowType[]>(() => {
  const rows = gridStore.value?.gridOptions?.data as RowType[] | undefined;
  return rows ?? [];
});
const menuType = ref<number | undefined>(0);
const toolbarMenuText = computed(() => {
  let text = '';
  if (typeof menuType.value === 'number') {
    text = menuMap.get(menuType.value)?.title ?? '';
  }
  return text ? `新增${text}` : '';
});

const [Model, modalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: ExtraModel,
  class: 'w-1/2',
  onClosed() {
    const share = modalApi.getData();
    if (share.loaded === true) {
      gridApi.reload();
      modalApi.setData({
        loaded: false,
      });
    }
  },
});

const handleAddMenu = () => {
  const title = `新增${menuMap.get(menuType.value as number)?.title}`;
  modalApi
    .setState({
      title,
    })
    .setData({
      type: menuType.value,
      $: {
        behavior: 'add',
        treeCache: unref(data),
      },
    })
    .open();
};

const handleEditMenu = (row: RowType) => {
  const { pid, id, sort, name, url, icon } = row;

  const prefixUrl = (() => {
    const options = {
      extractVal: 'url' as const,
      returnVal: 'nodes' as const,
    };
    const nodes = getFullPath({
      id,
      data: data.value,
      options,
    })! as string[];
    return nodes.slice(0, -1).join('/');
  })();
  const title = `编辑${menuMap.get(menuType.value as number)?.title}`;
  modalApi
    .setState({
      title,
    })
    .setData({
      type: menuType.value,
      pid,
      id,
      sort,
      name,
      url,
      icon,
      $: {
        prefixUrl,
        behavior: 'edit',
      },
    })
    .open();
};

const handleDeleteMenu = (row: RowType) => {
  const { id, name } = row;
  const title = `删除${menuMap.get(menuType.value as number)?.title}`;
  const content = `确认删除${name}该${menuMap.get(menuType.value as number)?.title}吗？`;
  confirm({
    cancelText: '取消',
    confirmText: '删除',
    content,
    icon: 'warning',
    title,
    buttonAlign: 'center',
    overlayBlur: 2,
  })
    .then(() => {
      return deleteMenuApi(id);
    })
    .then(() => {
      ElMessage.success(`${title}成功`);
      gridApi.reload();
    })
    .catch(() => {});
};
</script>

<template>
  <div class="h-[500px] w-full p-5">
    <Grid>
      <template #toolbar-actions>
        <ElButton
          v-if="menuType !== undefined"
          type="primary"
          size="small"
          @click="handleAddMenu"
        >
          {{ toolbarMenuText }}
        </ElButton>
      </template>

      <template #type="{ row }">
        <template v-if="menuMap.has(row.type)">
          <ElText :type="menuMap.get(row.type)?.type">
            {{ menuMap.get(row.type)?.title }}
          </ElText>
        </template>
      </template>

      <template #menu-url="{ row }">
        <!-- 目录 -->
        <template v-if="Array.isArray(row.children) && row.children.length > 0">
          <ElTooltip :content="row.url" placement="top">
            <ElText type="primary"> # </ElText>
          </ElTooltip>
        </template>
        <!-- 菜单 -->
        <template v-else>
          <ElText class="underline" type="primary">
            {{
              getFullPath({
                id: row.id,
                data,
                options: {
                  extractVal: 'url' as const,
                  returnVal: 'result' as const,
                },
              })
            }}
          </ElText>
        </template>
      </template>
      <template #action="{ row }">
        <ElButton type="primary" link size="small" @click="handleEditMenu(row)">
          编辑
        </ElButton>
        <ElButton
          type="danger"
          link
          size="small"
          @click="handleDeleteMenu(row)"
        >
          删除
        </ElButton>
      </template>
    </Grid>

    <Model />
  </div>
</template>
