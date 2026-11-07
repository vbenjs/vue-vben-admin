<script lang="ts" setup>
import type { ActionItem } from '@vben/common-ui';

import type { VxeGridProps } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Button, Card, message, Tag } from 'antdv-next';

import { useVbenVxeGrid, VbenTableAction } from '#/adapter/vxe-table';

import DocButton from '../doc-button.vue';
import { MOCK_TABLE_DATA } from '../vxe-table/table-data';

interface RowType {
  address: string;
  age: number;
  id: number;
  name: string;
  nickname: string;
  role: string;
}

/* 基础用法 */
const divider = ref(true);
const align = ref<'center' | 'end' | 'start'>('start');
const alignOptions = ['start', 'center', 'end'] as const;

const basicActions: ActionItem[] = [
  { icon: 'lucide:eye', onClick: () => message.info('查看'), text: '查看' },
  { icon: 'lucide:edit', onClick: () => message.info('编辑'), text: '编辑' },
  { disabled: true, icon: 'lucide:lock', text: '禁用' },
  {
    danger: true,
    icon: 'lucide:trash-2',
    onClick: () => message.warning('删除'),
    text: '删除',
  },
];

/* 提示 */
const tooltipActions: ActionItem[] = [
  { icon: 'lucide:eye', tooltip: '查看详情' },
  { icon: 'lucide:edit', tooltip: { content: '右侧提示', side: 'right' } },
  { icon: 'lucide:copy', tooltip: { content: '底部提示', side: 'bottom' } },
  {
    icon: 'lucide:download',
    text: '下载',
    tooltip: { content: '左侧提示', side: 'left' },
  },
];

/* 气泡确认 & 加载状态 */
const submitting = ref(false);

function onSubmit() {
  submitting.value = true;
  setTimeout(() => {
    submitting.value = false;
    message.success('提交成功');
  }, 1500);
}

/* 更多下拉 */
const showMoreText = ref(true);

const dropdownMainActions: ActionItem[] = [
  { icon: 'lucide:edit', onClick: () => message.info('编辑'), text: '编辑' },
];

const dropdownActions: ActionItem[] = [
  { icon: 'lucide:copy', onClick: () => message.info('复制'), text: '复制' },
  {
    icon: 'lucide:download',
    onClick: () => message.info('导出'),
    text: '导出',
  },
  { disabled: true, icon: 'lucide:archive', text: '归档（禁用）' },
  {
    danger: true,
    icon: 'lucide:trash-2',
    popConfirm: {
      confirm: () => message.success('已移除'),
      title: '确定移除吗？',
    },
    text: '移除',
  },
];

/* 权限控制 */
const permissionCodes = ['AC_EDIT', 'AC_EXPORT', 'AC_DELETE'] as const;
const ownedCodes = ref(new Set<string>(['AC_EDIT']));

function toggleCode(code: string) {
  if (ownedCodes.value.has(code)) {
    ownedCodes.value.delete(code);
  } else {
    ownedCodes.value.add(code);
  }
}

function hasPermission(auth?: string | string[]) {
  if (!auth) return true;
  const codes = Array.isArray(auth) ? auth : [auth];
  return codes.some((code) => ownedCodes.value.has(code));
}

const permissionActions: ActionItem[] = [
  { onClick: () => message.info('查看'), text: '查看（无需权限）' },
  { auth: 'AC_EDIT', onClick: () => message.info('编辑'), text: '编辑' },
  { auth: 'AC_EXPORT', onClick: () => message.info('导出'), text: '导出' },
];

const permissionDropdownActions: ActionItem[] = [
  {
    auth: 'AC_DELETE',
    danger: true,
    onClick: () => message.warning('删除'),
    text: '删除',
  },
];

/* 表格中使用 */
const disabledIds = ref(new Set<number>());
const syncingIds = ref(new Set<number>());

const gridOptions: VxeGridProps<RowType> = {
  columns: [
    { title: '序号', type: 'seq', width: 50 },
    { field: 'name', title: 'Name' },
    { field: 'role', title: 'Role' },
    { field: 'address', showOverflow: true, title: 'Address' },
    { field: 'status', slots: { default: 'status' }, title: 'Status' },
    {
      align: 'center',
      field: 'operation',
      fixed: 'right',
      slots: { default: 'action' },
      title: '操作',
      width: 280,
    },
  ],
  data: MOCK_TABLE_DATA.slice(0, 20).map((item) => ({ ...item })),
  height: 420,
  pagerConfig: {
    enabled: false,
  },
};

const [Grid, gridApi] = useVbenVxeGrid<RowType>({ gridOptions });

function onSync(row: RowType) {
  syncingIds.value.add(row.id);
  setTimeout(() => {
    syncingIds.value.delete(row.id);
    message.success(`已同步：${row.name}`);
  }, 1500);
}

function onToggleStatus(row: RowType) {
  if (disabledIds.value.has(row.id)) {
    disabledIds.value.delete(row.id);
    message.success(`已启用：${row.name}`);
  } else {
    disabledIds.value.add(row.id);
    message.warning(`已禁用：${row.name}`);
  }
}

async function onDelete(row: RowType) {
  await gridApi.grid.remove(row);
  message.success(`已删除：${row.name}`);
}

function createRowActions(row: RowType): ActionItem[] {
  return [
    {
      icon: 'lucide:eye',
      key: 'detail',
      onClick: () => message.info(`查看详情：${row.name}`),
      text: '详情',
      tooltip: `查看 ${row.name} 的详细信息`,
    },
    {
      disabled: row.role === 'Guest',
      icon: 'lucide:edit',
      key: 'edit',
      onClick: () => message.info(`编辑：${row.name}`),
      text: '编辑',
    },
    {
      icon: 'lucide:refresh-cw',
      key: 'sync',
      loading: syncingIds.value.has(row.id),
      onClick: () => onSync(row),
      text: '同步',
    },
  ];
}

function createRowDropdownActions(row: RowType): ActionItem[] {
  const isDisabled = disabledIds.value.has(row.id);
  return [
    {
      icon: 'lucide:circle-check',
      ifShow: isDisabled,
      key: 'enable',
      onClick: () => onToggleStatus(row),
      text: '启用',
    },
    {
      icon: 'lucide:circle-slash',
      ifShow: !isDisabled,
      key: 'disable',
      onClick: () => onToggleStatus(row),
      text: '禁用',
    },
    {
      auth: 'AC_100030',
      icon: 'lucide:key-round',
      key: 'reset-password',
      onClick: () => message.success(`已重置密码：${row.name}`),
      text: '重置密码',
    },
    {
      auth: 'AC_100100',
      danger: true,
      icon: 'lucide:trash-2',
      ifShow: () => row.role !== 'Admin',
      key: 'delete',
      popConfirm: {
        confirm: () => onDelete(row),
        title: `确定删除 ${row.name} 吗？`,
      },
      text: '删除',
    },
  ];
}
</script>

<template>
  <Page
    description="TableAction 用于渲染一组操作按钮，支持提示、气泡确认、加载/禁用状态、「更多」下拉、按条件显示与权限过滤，既可单独使用，也可放在表格操作列中。"
    title="TableAction 表格操作"
  >
    <template #extra>
      <DocButton path="/components/common-ui/vben-table-action" />
    </template>

    <Card class="mb-5" title="基础用法">
      <template #extra>
        <Button class="mr-2" size="small" @click="divider = !divider">
          {{ divider ? '隐藏' : '显示' }}分割线
        </Button>
        <Button
          v-for="item in alignOptions"
          :key="item"
          :type="align === item ? 'primary' : 'default'"
          class="ml-1"
          size="small"
          @click="align = item"
        >
          {{ item }}
        </Button>
      </template>
      <VbenTableAction
        :actions="basicActions"
        :align="align"
        :divider="divider"
      />
    </Card>

    <Card class="mb-5" title="提示">
      <VbenTableAction :actions="tooltipActions" align="start" />
    </Card>

    <Card class="mb-5" title="气泡确认 & 加载状态">
      <VbenTableAction
        :actions="[
          {
            danger: true,
            icon: 'lucide:trash-2',
            popConfirm: {
              cancelText: '再想想',
              confirm: () => message.success('已删除'),
              okText: '删除',
              title: '删除后不可恢复，确定删除吗？',
            },
            text: '删除',
          },
          {
            icon: 'lucide:send',
            popConfirm: { confirm: onSubmit, title: '确定提交吗？' },
            text: '提交（默认文案）',
          },
          {
            icon: 'lucide:loader',
            loading: submitting,
            onClick: onSubmit,
            text: submitting ? '提交中' : '直接提交',
          },
        ]"
        align="start"
      />
    </Card>

    <Card class="mb-5" title="更多下拉">
      <template #extra>
        <Button size="small" @click="showMoreText = !showMoreText">
          {{ showMoreText ? '隐藏' : '显示' }}「更多」文案
        </Button>
      </template>
      <VbenTableAction
        :actions="dropdownMainActions"
        :dropdown-actions="dropdownActions"
        :more-text="showMoreText ? '更多' : undefined"
        align="start"
      />
    </Card>

    <Card class="mb-5" title="权限控制">
      <template #extra>
        <span class="mr-2 text-sm opacity-70">当前拥有的权限码：</span>
        <Button
          v-for="code in permissionCodes"
          :key="code"
          :type="ownedCodes.has(code) ? 'primary' : 'default'"
          class="ml-1"
          size="small"
          @click="toggleCode(code)"
        >
          {{ code }}
        </Button>
      </template>
      <VbenTableAction
        :actions="permissionActions"
        :dropdown-actions="permissionDropdownActions"
        :has-permission="hasPermission"
        align="start"
      />
      <p class="mt-3 text-sm opacity-70">
        此处显式传入 hasPermission 以便本地切换权限码；从 #/adapter/vxe-table
        引入时默认使用当前登录用户的权限码，无需手动传入。
      </p>
    </Card>

    <Card title="在表格中使用">
      <p class="mb-3 text-sm opacity-70">
        Guest 行不可编辑；Admin 行不显示删除；「重置密码」需要 AC_100030，
        「删除」需要 AC_100100，切换不同账号登录可观察差异。
      </p>
      <Grid>
        <template #status="{ row }">
          <Tag :color="disabledIds.has(row.id) ? 'default' : 'success'">
            {{ disabledIds.has(row.id) ? '已禁用' : '正常' }}
          </Tag>
        </template>
        <template #action="{ row }">
          <VbenTableAction
            :actions="createRowActions(row)"
            :dropdown-actions="createRowDropdownActions(row)"
            align="center"
            divider
          />
        </template>
      </Grid>
    </Card>
  </Page>
</template>
