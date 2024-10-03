<script lang="ts" setup>
import type { VxeGridProps } from '@vben/plugins/vxe-table';

import { reactive } from 'vue';

import { Page } from '@vben/common-ui';
import { useVbenVxeGrid } from '@vben/plugins/vxe-table';

import { Button } from 'ant-design-vue';

interface RowVO {
  address: string;
  age: number;
  id: number;
  name: string;
  nickname: string;
  role: string;
  sex: string;
}

const list = [
  {
    address: 'Shenzhen',
    age: 28,
    id: 10_001,
    name: 'Test1',
    nickname: 'T1',
    role: 'Develop',
    sex: 'Man',
  },
  {
    address: 'Guangzhou',
    age: 22,
    id: 10_002,
    name: 'Test2',
    nickname: 'T2',
    role: 'Test',
    sex: 'Women',
  },
  {
    address: 'Shanghai',
    age: 32,
    id: 10_003,
    name: 'Test3',
    nickname: 'T3',
    role: 'PM',
    sex: 'Man',
  },
  {
    address: 'test abc',
    age: 23,
    id: 10_004,
    name: 'Test4',
    nickname: 'T4',
    role: 'Designer',
    sex: 'Women',
  },
  {
    address: 'Shanghai',
    age: 30,
    id: 10_005,
    name: 'Test5',
    nickname: 'T5',
    role: 'Develop',
    sex: 'Women',
  },
  {
    address: 'Shenzhen',
    age: 21,
    id: 10_006,
    name: 'Test6',
    nickname: 'T6',
    role: 'Designer',
    sex: 'Women',
  },
  {
    address: 'Shenzhen',
    age: 29,
    id: 10_007,
    name: 'Test7',
    nickname: 'T7',
    role: 'Test',
    sex: 'Man',
  },
  {
    address: 'test abc',
    age: 35,
    id: 10_008,
    name: 'Test8',
    nickname: 'T8',
    role: 'Develop',
    sex: 'Man',
  },
  {
    address: 'Shenzhen',
    age: 35,
    id: 10_009,
    name: 'Test9',
    nickname: 'T9',
    role: 'Develop',
    sex: 'Man',
  },
  {
    address: 'Guangzhou',
    age: 35,
    id: 100_010,
    name: 'Test10',
    nickname: 'T10',
    role: 'Develop',
    sex: 'Man',
  },
  {
    address: 'Guangzhou',
    age: 49,
    id: 100_011,
    name: 'Test11',
    nickname: 'T11',
    role: 'Develop',
    sex: 'Man',
  },
  {
    address: 'Shanghai',
    age: 45,
    id: 100_012,
    name: 'Test12',
    nickname: 'T12',
    role: 'Develop',
    sex: 'Women',
  },
  {
    address: 'Guangzhou',
    age: 35,
    id: 100_013,
    name: 'Test13',
    nickname: 'T13',
    role: 'Test',
    sex: 'Women',
  },
  {
    address: 'Shanghai',
    age: 29,
    id: 100_014,
    name: 'Test14',
    nickname: 'T14',
    role: 'Test',
    sex: 'Man',
  },
  {
    address: 'Guangzhou',
    age: 39,
    id: 100_015,
    name: 'Test15',
    nickname: 'T15',
    role: 'Develop',
    sex: 'Man',
  },
  {
    address: 'Guangzhou',
    age: 35,
    id: 100_016,
    name: 'Test16',
    nickname: 'T16',
    role: 'Test',
    sex: 'Women',
  },
  {
    address: 'Shanghai',
    age: 39,
    id: 100_017,
    name: 'Test17',
    nickname: 'T17',
    role: 'Test',
    sex: 'Man',
  },
  {
    address: 'Guangzhou',
    age: 44,
    id: 100_018,
    name: 'Test18',
    nickname: 'T18',
    role: 'Develop',
    sex: 'Man',
  },
  {
    address: 'Guangzhou',
    age: 39,
    id: 100_019,
    name: 'Test19',
    nickname: 'T19',
    role: 'Develop',
    sex: 'Man',
  },
  {
    address: 'Guangzhou',
    age: 35,
    id: 100_020,
    name: 'Test20',
    nickname: 'T20',
    role: 'Test',
    sex: 'Women',
  },
  {
    address: 'Shanghai',
    age: 39,
    id: 100_021,
    name: 'Test21',
    nickname: 'T21',
    role: 'Test',
    sex: 'Man',
  },
  {
    address: 'Guangzhou',
    age: 44,
    id: 100_022,
    name: 'Test22',
    nickname: 'T22',
    role: 'Develop',
    sex: 'Man',
  },
];

// 模拟接口
const findPageList = (pageSize: number, currentPage: number) => {
  // console.log(`调用查询接口 pageSize=${pageSize} currentPage=${currentPage}`);
  return new Promise<{
    page: {
      total: number;
    };
    result: RowVO[];
  }>((resolve) => {
    setTimeout(() => {
      resolve({
        page: {
          total: list.length,
        },
        result: list.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize,
        ),
      });
    }, 800);
  });
};

const gridOptions = reactive<VxeGridProps<RowVO>>({
  columns: [
    { type: 'seq', width: 70 },
    { field: 'name', title: 'Name' },
    { field: 'nickname', title: 'Nickname' },
    { field: 'role', title: 'Role' },
    { field: 'address', showOverflow: true, title: 'Address' },
  ],
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        return findPageList(page.pageSize, page.currentPage);
      },
    },
  },
});

const [Grid] = useVbenVxeGrid({ gridOptions });
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #actions>
        <Button class="mr-2" type="primary">新增</Button>
        <Button class="mr-2" type="default">编辑</Button>
        <Button type="default">删除</Button>
      </template>
      <template #tools>
        <Button class="mr-2" type="primary">工具按钮</Button>
      </template>
    </Grid>
  </Page>
</template>
