<script lang="ts" setup>
import type { UseVbenVxeGrid, VxeGridProps } from '#/adapter/vxe-table';

import { inject, onMounted } from 'vue';

interface RowType {
  id: number;
  name: string;
  role: string;
  sex: string;
}

const useVbenVxeGrid = inject<UseVbenVxeGrid>(
  'useVbenVxeGrid',
) as UseVbenVxeGrid;

const gridOptions: VxeGridProps<RowType> = {
  columns: [
    { type: 'seq', width: 70 },
    { field: 'name', title: 'Name' },
    { field: 'role', title: 'Role' },
    { field: 'sex', title: 'Sex' },
  ],
  data: [],
  height: 'auto',
  pagerConfig: {
    enabled: false,
  },
  scrollY: {
    enabled: true,
    gt: 0,
  },
  showOverflow: true,
};

const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });

// 模拟行数据
const loadList = (size = 200) => {
  try {
    const dataList: RowType[] = [];
    for (let i = 0; i < size; i++) {
      dataList.push({
        id: 10_000 + i,
        name: `Test${i}`,
        role: 'Developer',
        sex: '男',
      });
    }
    gridApi.setGridOptions({ data: dataList });
  } catch (error) {
    console.error('Failed to load data:', error);
    // Implement user-friendly error handling
  }
};

onMounted(() => {
  loadList(1000);
});
</script>

<template>
  <div class="vp-raw h-[500px] w-full">
    <Grid />
  </div>
</template>
